import json
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import decorators, mixins, permissions, response, status, viewsets, generics, parsers

from schemacms.users import permissions as user_permissions
from schemacms.utils import serializers as utils_serializers
from . import models, serializers, services


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsAdminOrReadOnly)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {"datasources": serializers.DataSourceSerializer}

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
        queryset = (
            project.data_sources.all().prefetch_related("jobs").available_for_user(user=self.request.user)
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    @decorators.action(detail=True, url_path="remove-editor", methods=["post"])
    def remove_editor(self, request, pk=None, **kwargs):
        project = self.get_object()
        editor_to_remove = request.data.get("id", None)

        if editor_to_remove:
            project.editors.remove(editor_to_remove)

            return response.Response(
                f"Editor {editor_to_remove} has been removed from project {project.id}",
                status=status.HTTP_200_OK,
            )
        else:
            return response.Response(
                "Please enter the user 'id' you want to remove from project.", status.HTTP_400_BAD_REQUEST
            )

    @decorators.action(detail=True, url_path="add-editor", methods=["post"])
    def add_editor(self, request, pk=None, **kwargs):
        project = self.get_object()
        editor_to_add = request.data.get("id", None)

        if editor_to_add:
            project.editors.add(editor_to_add)

            return response.Response(
                f"Editor {editor_to_add} has been added to project {project.id}", status=status.HTTP_200_OK
            )
        else:
            return response.Response(
                "Please enter the user 'id' you want to add.", status.HTTP_400_BAD_REQUEST
            )


class DataSourceViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = models.DataSource.objects.prefetch_related("jobs", "filters").order_by("-created")
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "create": serializers.DraftDataSourceSerializer,
        "script": serializers.DataSourceScriptSerializer,
        "script_upload": serializers.WranglingScriptSerializer,
        "job": serializers.CreateJobSerializer,
        "jobs_history": serializers.DataSourceJobSerializer,
        "public_results": serializers.PublicApiJobSerializer,
        "filters": serializers.FilterSerializer,
    }

    def get_queryset(self):
        if self.action == "public_results":
            return super().get_queryset()

        return super().get_queryset().available_for_user(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @decorators.action(detail=True, methods=["get"])
    def preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        if not hasattr(data_source, 'meta_data'):
            return response.Response({}, status=status.HTTP_200_OK)

        data = data_source.meta_data.data
        data["data_source"] = {"name": data_source.name}

        return response.Response(data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, methods=["post"])
    def process(self, request, pk=None, **kwargs):
        obj = self.get_object()
        try:
            return response.Response(obj.meta_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"DataSource {self.get_object().id} processing error - {e}")
            return response.Response(status=status.HTTP_404_NOT_FOUND)

    @decorators.action(detail=True)
    def script(self, request, pk=None, **kwargs):
        serializer = self.get_serializer(instance=self.get_object().available_scripts, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(
        detail=True,
        url_path="script-upload",
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        methods=["post"],
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
            transaction.on_commit(lambda: services.schedule_worker_with(job, datasource.file.size))
        return response.Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="jobs-history", methods=["get"])
    def jobs_history(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        queryset = data_source.jobs.all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(instance=data_source.jobs_history, many=True)
        return response.Response(data=serializer.data)

    @decorators.action(detail=True, permission_classes=[], url_path="public-results", methods=["get"])
    def public_results(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        job = data_source.current_job
        serializer = self.get_serializer(instance=job)

        return response.Response(data=serializer.data)

    @decorators.action(detail=True, url_path="fields-info", methods=["get"])
    def fields_info(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        try:
            preview = data_source.get_last_success_job().meta_data.preview
        except Exception as e:
            return response.Response(f"No successful job found - {e}", status=status.HTTP_404_NOT_FOUND)

        fields_info = dict(fields_info=json.loads(preview.read())["fields"])

        data = dict()
        for key, value in fields_info["fields_info"].items():
            data[key] = dict(type=models.map_general_dtypes(value["dtype"]), unique=value["unique"])

        return response.Response(data=data)

    @decorators.action(detail=True, url_path="filters", methods=["get", "post"])
    def filters(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        if request.method == 'GET':
            if not data_source.filters.exists():
                return response.Response(data=[])

            serializer = self.get_serializer(instance=data_source.filters, many=True)

            return response.Response(data=serializer.data)

        else:
            if not request.data.get("datasource"):
                filter_ = request.data.copy()
                filter_["datasource"] = data_source

            serializer = self.get_serializer(data=filter_, context=data_source)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="revert-job", methods=["post"])
    def revert_job(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        job_id = request.data.get("id", None)
        job = get_object_or_404(models.DataSourceJob, pk=job_id)

        data_source.set_active_job(job)

        return response.Response(status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path="job-preview", methods=["get"])
    def job_preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        try:
            job = data_source.current_job
        except ObjectDoesNotExist as e:
            return response.Response(str(e), status=status.HTTP_404_NOT_FOUND)

        return response.Response(job.meta_data.data, status=status.HTTP_200_OK)


class DataSourceJobDetailViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = models.DataSourceJob.objects.none()
    serializer_class = serializers.DataSourceJobSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.DataSourceJob.objects.all().select_related("datasource").prefetch_related("steps")

    @decorators.action(detail=True, url_path="preview", methods=["get"])
    def result_preview(self, request, pk=None, **kwarg):
        obj = self.get_object()
        try:
            result = obj.meta_data.data
        except ObjectDoesNotExist as e:
            return response.Response(str(e), status=status.HTTP_404_NOT_FOUND)

        return response.Response(result, status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path="update-meta", methods=["post"])
    def update_meta(self, request, pk=None, **kwarg):
        job = self.get_object()
        try:
            job.update_meta()
            job.datasource.set_active_job(job)
        except Exception as e:
            return response.Response(
                f"Unable to generate meta - {e}", status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        return response.Response(status=status.HTTP_201_CREATED)


class DataSourceScriptDetailView(generics.RetrieveAPIView):
    queryset = models.WranglingScript.objects.none()
    serializer_class = serializers.WranglingScriptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.WranglingScript.objects.all().select_related("datasource", "created_by")


class FilterDetailViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = models.Filter.objects.none()
    serializer_class = serializers.FilterSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.Filter.objects.all().select_related("datasource")
