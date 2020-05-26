import json
import os

from django.db import transaction
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import decorators, mixins, permissions, response, status, viewsets, generics, parsers

from . import constants, models, serializers
from .permissions import DataSourceListPermission
from ..authorization import authentication
from ..utils.serializers import ActionSerializerViewSetMixin, IDNameSerializer
from ..projects.models import Project


def copy_steps_from_active_job(steps, job):
    for step in steps:
        step.id = None
        step.datasource_job = job
        step.save()


class BaseDataSourceView:
    serializer_class = serializers.DataSourceSerializer
    queryset = (
        models.DataSource.objects.prefetch_related(
            "tags",
            "tags__category",
            "filters",
            Prefetch("active_job__steps", queryset=models.DataSourceJobStep.objects.order_by("exec_order")),
        )
        .select_related("project", "meta_data", "created_by", "active_job")
        .jobs_in_process()
    )

    permission_classes = (permissions.IsAuthenticated,)


class DataSourceListView(BaseDataSourceView, mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = (permissions.IsAuthenticated, DataSourceListPermission)

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        return super().get_queryset().filter(project=self.project_obj)

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if "raw_list" in request.query_params:
            serializer_ = IDNameSerializer(self.project_obj.data_sources, many=True)
            response_ = dict(project=self.project_obj.project_info, results=serializer_.data)
            return response.Response(response_, status=status.HTTP_200_OK)

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_ = self.get_paginated_response(serializer.data)
            response_.data["project"] = self.project_obj.project_info
            return response_

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.project_obj.project_info, "results": serializer.data}

        return response.Response(data)


class DataSourceViewSet(BaseDataSourceView, ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class_mapping = {
        "retrieve": serializers.DataSourceDetailSerializer,
        "update": serializers.DataSourceDetailSerializer,
        "partial_update": serializers.DataSourceDetailSerializer,
        "script": serializers.DataSourceScriptSerializer,
        "script_upload": serializers.WranglingScriptSerializer,
        "job": serializers.CreateJobSerializer,
        "jobs_history": serializers.DataSourceJobSerializer,
        "filters": serializers.FilterSerializer,
        "tags": serializers.DataSourceTagSerializer,
        "addition_description": serializers.DataSourceDescriptionSerializer,
        "set_filters": serializers.FilterSerializer,
        "update_meta": serializers.PublicApiUpdateMetaSerializer,
    }

    def get_queryset(self):
        return super().get_queryset().annotate_filters_count().available_for_user(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if "file" in serializer.validated_data:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()

    @decorators.action(detail=True, methods=["get"])
    def preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        if not hasattr(data_source, "meta_data"):
            return response.Response({}, status=status.HTTP_200_OK)

        data = dict(
            results=data_source.meta_data.data,
            data_source={"name": data_source.name},
            project=data_source.project_info,
        )

        return response.Response(data, status=status.HTTP_200_OK)

    @decorators.action(detail=True)
    def script(self, request, pk=None, **kwargs):
        serializer = self.get_serializer(instance=self.get_object().available_scripts, many=True)
        return response.Response(data=serializer.data, status=status.HTTP_200_OK)

    @decorators.action(
        detail=True,
        url_path="script-upload",
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        methods=["post"],
    )
    def script_upload(self, request, pk=None, **kwargs):
        datasource = self.get_object()
        request.data["datasource"] = datasource
        if not request.data.get("name"):
            request.data["name"] = os.path.splitext(request.data["file"].name)[0]

        serializer = self.get_serializer(data=request.data, context=datasource)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return response.Response(status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="job", methods=["post"])
    def job(self, request, pk=None, **kwargs):
        datasource = self.get_object()

        if datasource.jobs and datasource.jobs_in_process:
            message = "Previous jobs is still in PROCESSING"
            return response.Response(data=message, status=status.HTTP_400_BAD_REQUEST)

        request.data["datasource"] = datasource
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            job = serializer.save()
            datasource.save()  # refresh "modified" field
            transaction.on_commit(job.schedule)
        return response.Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path="jobs-history", methods=["get"])
    def jobs_history(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        queryset = data_source.jobs.prefetch_related("steps__script").order_by("-created")

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_ = self.get_paginated_response(serializer.data)
            response_.data["project"] = data_source.project_info
            return response_

        serializer = self.get_serializer(instance=data_source.jobs_history, many=True)
        response_data = dict(project=data_source.project_info, results=serializer.data)
        return response.Response(response_data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path="fields-info", methods=["get"])
    def fields_info(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        states_view = request.query_params.get("states_view", False)
        field_name = request.query_params.get("field_name", None)

        try:
            preview = data_source.active_job.meta_data.preview
        except Exception as e:
            return response.Response(f"No successful job found - {e}", status=status.HTTP_404_NOT_FOUND)

        data = dict(project=data_source.project_info, results=[])

        if states_view and field_name:
            data = self.create_single_field_info_response(preview, field_name, data)
        else:
            fields = json.loads(preview.read())["fields"]

            for key, value in fields.items():
                data["results"].append(
                    dict(
                        field_name=key,
                        field_type=value["dtype"],
                        unique=value["unique"],
                        filter_type=getattr(constants.FilterTypesGroups, value["dtype"]),
                    )
                )

        return response.Response(data=data)

    @staticmethod
    def create_single_field_info_response(preview, field_name, response_data):
        field = json.loads(preview.read())["fields"][field_name]
        if field["dtype"] != "number":
            response_data["results"] = field["unique_values"]
        else:
            response_data["results"] = [field["min"], field["max"]]

        return response_data

    @decorators.action(detail=True, url_path="filters", methods=["get", "post"])
    def filters(self, request, pk=None, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="filters", parent_object_name="datasource"
        )

    @decorators.action(detail=True, url_path="tags", methods=["get", "post", "patch"])
    def tags(self, request, pk=None, **kwargs):
        ds = self.get_object()

        if request.method == "GET":
            serializer = self.get_serializer(ds.tags, many=True)

        if request.method in ["POST", "PATCH"]:
            tags = request.data
            ds.add_tags(tags)
            ds.refresh_from_db()
            serializer = self.get_serializer(ds.tags, many=True)

        return response.Response({"project": ds.project.project_info, "results": serializer.data})

    @decorators.action(detail=True, url_path="description", methods=["get", "post", "patch"])
    def addition_description(self, request, pk=None, **kwargs):
        ds = self.get_object()

        if request.method == "GET":

            data = self.get_serializer(ds.description).data if hasattr(ds, "description") else {"data": []}

        if request.method in ["POST", "PATCH"]:
            description = ds.add_description(request.data)
            data = self.get_serializer(description).data

        return response.Response({"project": ds.project.project_info, "results": data})

    @decorators.action(detail=True, url_path="set-filters", methods=["post"])
    def set_filters(self, request, pk=None, **kwargs):
        data_source = self.set_is_active_fields(request, related_objects_name="filters")

        serializer = self.get_serializer(instance=data_source.filters, many=True)

        return response.Response(serializer.data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path="revert-job", methods=["post"])
    def revert_job(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        job_id = request.data.get("id", None)
        job = get_object_or_404(models.DataSourceJob, pk=job_id)

        data_source.set_active_job(job)
        serializer = self.get_serializer(instance=data_source, context=data_source)

        return response.Response(serializer.data, status=status.HTTP_200_OK)

    @decorators.action(
        detail=True,
        url_path="update-meta",
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        authentication_classes=[authentication.EnvTokenAuthentication],
    )
    def update_meta(self, request, *args, **kwargs):
        data_source = self.get_object()
        copy_steps = request.data.pop("copy_steps", None)
        status_ = request.data.get("status")

        serializer = self.get_serializer(data=request.data, context=data_source.meta_data)
        serializer.is_valid(raise_exception=True)

        data_source.update_meta(**serializer.validated_data)

        if status_ == constants.ProcessingState.SUCCESS:
            with transaction.atomic():
                fake_job = data_source.create_job(description=f"DataSource {data_source.id} file upload")

                if copy_steps:
                    copy_steps_from_active_job(data_source.active_job.steps.all(), fake_job)

                    data_source.active_job = None
                    data_source.save(update_fields=["active_job"])

                transaction.on_commit(fake_job.schedule)

        return response.Response(status=status.HTTP_204_NO_CONTENT)


class DataSourceJobDetailViewSet(
    ActionSerializerViewSetMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet,
):
    queryset = models.DataSourceJob.objects.none()
    serializer_class = serializers.JobDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "update_state": serializers.PublicApiDataSourceJobStateSerializer,
        "update_meta": serializers.PublicApiUpdateJobMetaSerializer,
    }

    def get_queryset(self):
        return models.DataSourceJob.objects.all().select_related("datasource").prefetch_related("steps")

    @decorators.action(detail=True, url_path="preview", methods=["get"])
    def result_preview(self, request, pk=None, **kwarg):
        obj = self.get_object()

        response_data = dict(project=obj.project_info)
        try:
            if not hasattr(obj, "meta_data") and obj.result:
                obj.update_meta()
            response_data["results"] = obj.meta_data.data
        except Exception as e:
            return response.Response(str(e), status=status.HTTP_404_NOT_FOUND)

        return response.Response(response_data, status=status.HTTP_200_OK)

    @decorators.action(
        detail=True,
        url_path="update-state",
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        authentication_classes=[authentication.EnvTokenAuthentication],
    )
    def update_state(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(instance=job, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

    @decorators.action(
        detail=True,
        url_path="update-meta",
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        authentication_classes=[authentication.EnvTokenAuthentication],
    )
    def update_meta(self, request, *args, **kwargs):
        job = self.get_object()

        serializer = self.get_serializer(data=request.data, context=job)
        serializer.is_valid(raise_exception=True)
        job.update_meta(**serializer.validated_data)

        return response.Response(status=status.HTTP_204_NO_CONTENT)


class DataSourceScriptDetailView(generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = models.WranglingScript.objects.none()
    serializer_class = serializers.WranglingScriptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.WranglingScript.objects.all().select_related("datasource", "created_by")


class FilterDetailViewSet(
    mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    queryset = models.Filter.objects.all().select_related("datasource")
    serializer_class = serializers.FilterDetailsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.datasource.project_info, "results": serializer.data}
        return response.Response(data)
