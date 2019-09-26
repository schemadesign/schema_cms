import logging

from django.db import transaction
from rest_framework import decorators, exceptions, permissions, response, status, viewsets, generics, parsers

from schemacms.users import permissions as user_permissions
from . import constants, models, serializers, permissions as projects_permissions, services


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
        obj = self.get_object()
        try:
            obj.ready_for_processing()
            obj.process()
            obj.done()
            obj.save()
            logging.info(f"DataSource {obj.id} processing DONE")
            return response.Response(obj.meta_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"DataSource {self.get_object().id} processing error - {e}")
            obj.status = constants.DataSourceStatus.ERROR
            obj.save()
            return response.Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class DataSourceScriptView(generics.GenericAPIView):
    queryset = models.DataSource.objects.all()

    def get(self, request, *args, **kwargs):
        serializer = serializers.DataSourceScriptSerializer(
            instance=self.get_object().available_scripts, many=True
        )
        return response.Response(data=serializer.data)


class DataSourceScriptUploadView(generics.GenericAPIView):
    parser_classes = (parsers.FormParser, parsers.MultiPartParser)
    queryset = models.DataSource.objects.all()
    serializer_class = serializers.DataSourceScriptUploadSerializer

    def post(self, request, **kwargs):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(status=status.HTTP_201_CREATED)


class DataSourceJobView(generics.CreateAPIView):
    queryset = models.DataSource.objects.all()
    serializer_class = serializers.DataSourceJobSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        job = serializer.save(datasource=self.get_object())
        services.schedule_worker_with(job)


class DataSourceJobDetailView(generics.RetrieveAPIView):
    queryset = models.DataSourceJob.objects.all()
    serializer_class = serializers.DataSourceJobSerializer
