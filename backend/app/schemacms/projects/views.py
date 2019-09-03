from rest_framework import decorators, exceptions, permissions, response, viewsets

from . import models, serializers, permissions as projects_permissions


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, projects_permissions.IsAdminOrReadOnly)
    queryset = models.Project.objects.none()

    def get_queryset(self):
        return models.Project.get_projects_for_user(self.request.user)


class DataSourceViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = models.DataSource.objects.order_by("-created")
    permission_classes = (
        permissions.IsAuthenticated,
        projects_permissions.IsAdminOrReadOnly,
        projects_permissions.HasProjectPermission,
    )

    def initial(self, request, *args, **kwargs):
        self.project = self.get_project(url_kwargs=kwargs)
        super().initial(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.DraftDataSourceSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        serializer.save(project=self.project)

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
        table_preview, fields_info = self.get_object().get_preview_data()

        return response.Response({"data": table_preview, "fields": fields_info})
