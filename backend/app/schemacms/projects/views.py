import logging

from django.db import transaction
from rest_framework import decorators, permissions, response, status, viewsets, generics, parsers

from schemacms.users import permissions as user_permissions
from schemacms.utils import serializers as utils_serializers
from . import constants, models, serializers, services


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsAdminOrReadOnly)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "datasources": serializers.DataSourceSerializer,
    }

    def get_queryset(self):
        return (
            models.Project.get_projects_for_user(self.request.user)
            .annotate_data_source_count()
            .select_related("owner")
            .prefetch_related("editors")
            .order_by("-created")
        )

    @decorators.action(detail=True, methods=["get"])
    def datasources(self, request, **kwargs):
        project = self.get_object()
        queryset = project.data_sources.all().available_for_user(user=self.request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)


class DataSourceViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = models.DataSource.objects.order_by("-created")
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "create": serializers.DraftDataSourceSerializer,
        "script": serializers.DataSourceScriptSerializer,
        "script_upload": serializers.WranglingScriptSerializer,
        "job": serializers.DataSourceJobSerializer,
    }

    def get_queryset(self):
        return super().get_queryset().available_for_user(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

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

    @decorators.action(detail=True)
    def script(self, request, pk=None, **kwargs):
        serializer = self.get_serializer(instance=self.get_object().available_scripts, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(
        detail=True,
        url_path="script-upload",
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        methods=["post"]
    )
    def script_upload(self, request, pk=None, **kwargs):
        datasource = self.get_object()
        if not request.data.get("datasource"):
            request.data["datasource"] = datasource
        serializer = self.get_serializer(data=request.data, context=datasource)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="job", methods=["post"])
    def job(self, request, pk=None, **kwargs):
        datasource = self.get_object()
        if not request.data.get("datasource"):
            request.data["datasource"] = datasource
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            job = serializer.save()
            transaction.on_commit(lambda: services.schedule_worker_with(job))
        return response.Response(status=status.HTTP_201_CREATED)


class DataSourceJobDetailView(generics.RetrieveAPIView):
    queryset = models.DataSourceJob.objects.none()
    serializer_class = serializers.DataSourceJobSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return (
            models.DataSourceJob.objects.all()
            .select_related("datasource")
            .prefetch_related("steps")
        )


class DataSourceScriptDetailView(generics.RetrieveAPIView):
    queryset = models.WranglingScript.objects.none()
    serializer_class = serializers.WranglingScriptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return (
            models.WranglingScript.objects.all()
            .select_related("datasource", "created_by")
        )
