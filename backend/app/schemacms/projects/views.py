import json
import logging

from rest_framework import decorators, exceptions, permissions, response, status, viewsets

from schemacms.users import permissions as user_permissions
from . import constants, models, serializers, permissions as projects_permissions


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsAdminOrReadOnly)
    queryset = models.Project.objects.none()

    def get_queryset(self):
        return (
            models.Project.get_projects_for_user(self.request.user)
            .annotate_data_source_count()
            .select_related("owner")
            .prefetch_related("editors")
            .order_by("-created")
        )


class DataSourceViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = models.DataSource.objects.order_by("-created")
    permission_classes = (permissions.IsAuthenticated, projects_permissions.HasProjectPermission)

    def initial(self, request, *args, **kwargs):
        self.project = self.get_project(url_kwargs=kwargs)
        super().initial(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.DraftDataSourceSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        serializer.save(project=self.project, created_by=self.request.user)

    def get_queryset(self):
        return super().get_queryset().filter(project=self.project)

    @classmethod
    def get_project(cls, url_kwargs):
        try:
            return models.Project.objects.get(pk=url_kwargs["project_pk"])
        except models.Project.DoesNotExist:
            raise exceptions.NotFound("The project does not exist")
        except KeyError:
            raise exceptions.NotFound("Invalid project ID")

    @decorators.action(detail=True, methods=["get"])
    def preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        data = data_source.meta_data.data
        data["data_source"] = {"name": data_source.name}
        return response.Response(data)

    @decorators.action(detail=True, methods=["post"])
    def process(self, request, pk=None, **kwargs):
        try:
            obj = self.get_object()
            obj.preview_process()
            obj.done()
            obj.save()
            logging.info(f"DataSource {obj.id} processing DONE")
            return response.Response(obj.meta_data.data, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"DataSource {self.get_object().id} processing error - {e}")
            self.get_object().status = constants.DataSourceStatus.ERROR
            self.get_object().save()
            return response.Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
