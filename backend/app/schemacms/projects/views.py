import json
import os

from django.db import transaction
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import decorators, mixins, permissions, response, status, viewsets, generics, parsers

from schemacms.authorization import authentication
from schemacms.users import permissions as user_permissions
from schemacms.utils import serializers as utils_serializers
from . import constants, models, serializers


def copy_steps_from_active_job(steps, job):
    for step in steps:
        step.id = None
        step.datasource_job = job
        step.save()


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.ProjectAccessPermission)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "datasources": serializers.DataSourceSerializer,
        "folders": serializers.FolderSerializer,
        "users": serializers.ProjectEditorSerializer,
        "states": serializers.StateSerializer,
    }

    def get_queryset(self):
        if self.action == "retrieve":
            queryset = models.Project.objects.all()
        else:
            queryset = models.Project.get_projects_for_user(self.request.user)

        return (
            queryset.annotate_data_source_count()
            .annotate_pages_count()
            .select_related("owner")
            .prefetch_related("editors", "folders")
            .order_by("-created")
        )

    @decorators.action(detail=True, url_path="datasources", methods=["get"])
    def datasources(self, request, **kwargs):
        project = self.get_object()

        if "raw_list" in request.query_params:
            serializer_ = serializers.RawDataSourceSerializer(project.data_sources, many=True)
            response_ = dict(project=project.project_info, results=serializer_.data)
            return response.Response(response_, status=status.HTTP_200_OK)

        queryset = (
            project.data_sources.all()
            .jobs_in_process()
            .prefetch_related("filters", "active_job__steps")
            .select_related("project", "meta_data", "created_by", "active_job")
            .annotate_filters_count()
            .available_for_user(user=self.request.user)
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_ = self.get_paginated_response(serializer.data)
            response_.data["project"] = project.project_info
            return response_

        serializer = self.get_serializer(queryset, many=True)
        response_data = dict(project=project.project_info, results=serializer.data)
        return response.Response(response_data)

    @decorators.action(detail=True, url_path="users", methods=["get"])
    def users(self, request, **kwargs):
        project = self.get_object()
        editors = project.editors.all().order_by("last_name")

        page = self.paginate_queryset(editors)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_ = self.get_paginated_response(serializer.data)
            response_.data["project"] = project.project_info
            return response_

        serializer = self.get_serializer(editors, many=True)
        response_data = dict(project=project.project_info, results=serializer.data)
        return response.Response(response_data)

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

    @decorators.action(
        detail=True, url_path="folders", methods=["get", "post"],
    )
    def folders(self, request, **kwargs):
        project = self.get_object()

        if request.method == "GET":
            queryset = project.folders.select_related("created_by").all()
            serializer = self.get_serializer(queryset, many=True)
            data = {"project": project.project_info, "results": serializer.data}
            return response.Response(data, status=status.HTTP_200_OK)

        else:
            request.data["project"] = project.id

            serializer = self.get_serializer(data=request.data, context=project)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(
        detail=True, url_path="states", methods=["get", "post"],
    )
    def states(self, request, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="states", parent_object_name="project"
        )


class DataSourceViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = models.DataSource.objects.prefetch_related(
        "filters", "list_of_tags", "active_job__steps"
    ).select_related("project", "meta_data", "created_by", "active_job")
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "retrieve": serializers.DataSourceDetailSerializer,
        "update": serializers.DataSourceDetailSerializer,
        "partial_update": serializers.DataSourceDetailSerializer,
        "script": serializers.DataSourceScriptSerializer,
        "script_upload": serializers.WranglingScriptSerializer,
        "job": serializers.CreateJobSerializer,
        "jobs_history": serializers.DataSourceJobSerializer,
        "filters": serializers.FilterSerializer,
        "set_filters": serializers.FilterSerializer,
        "tags_lists": serializers.TagsListSerializer,
        "set_tags_lists": serializers.TagsListSerializer,
        "update_meta": serializers.PublicApiUpdateMetaSerializer,
    }

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .annotate_filters_count()
            .jobs_in_process()
            .available_for_user(user=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if "file" in serializer.validated_data:
            serializer.save(created_by=self.request.user)

    @decorators.action(detail=True, methods=["get"])
    def preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        if not hasattr(data_source, 'meta_data'):
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

        try:
            preview = data_source.active_job.meta_data.preview
        except Exception as e:
            return response.Response(f"No successful job found - {e}", status=status.HTTP_404_NOT_FOUND)

        fields = json.loads(preview.read())["fields"]

        data = dict(project=data_source.project_info, results={})
        for key, value in fields.items():
            data["results"][key] = dict(
                field_type=value["dtype"],
                unique=value["unique"],
                filter_type=getattr(constants.FilterTypesGroups, value["dtype"]),
            )

        return response.Response(data=data)

    @decorators.action(detail=True, url_path="filters", methods=["get", "post"])
    def filters(self, request, pk=None, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="filters", parent_object_name="datasource"
        )

    @decorators.action(detail=True, url_path='set-filters', methods=["post"])
    def set_filters(self, request, pk=None, **kwargs):
        data_source = self.set_is_active_fields(request, related_objects_name="filters")

        data_source.create_dynamo_item()

        serializer = self.get_serializer(instance=data_source.filters, many=True)

        return response.Response(serializer.data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path='tags-lists', methods=["get", "post"])
    def tags_lists(self, request, pk=None, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="list_of_tags", parent_object_name="datasource"
        )

    @decorators.action(detail=True, url_path='set-tags-lists', methods=["post"])
    def set_tags_lists(self, request, pk=None, **kwargs):
        data_source = self.set_is_active_fields(request, related_objects_name="list_of_tags")

        serializer = self.get_serializer(instance=data_source.list_of_tags, many=True)

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
    utils_serializers.ActionSerializerViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
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
            if not hasattr(obj, 'meta_data') and obj.result:
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


class FolderViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Folder.objects.select_related("project", "created_by").all()
    serializer_class = serializers.FolderSerializer
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "retrieve": serializers.FolderDetailSerializer,
        "partial_update": serializers.FolderDetailSerializer,
        "update": serializers.FolderDetailSerializer,
        "pages": serializers.PageSerializer,
    }

    @decorators.action(detail=True, url_path='pages', methods=["GET", "POST"])
    def pages(self, request, pk=None, **kwargs):
        folder = self.get_object()

        if request.method == "GET":
            queryset = folder.pages.select_related("created_by").all()
            serializer = self.get_serializer(instance=queryset, many=True)
            data = {"project": folder.project_info, "results": serializer.data}
            return response.Response(data, status=status.HTTP_200_OK)

        else:
            request.data["folder"] = folder.id

            serializer = self.get_serializer(data=request.data, context=folder)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)


class PageViewSet(
    utils_serializers.ActionSerializerViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Page.objects.prefetch_related("blocks").select_related("folder", "created_by").all()
    serializer_class = serializers.PageSerializer
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "retrieve": serializers.PageDetailSerializer,
        "update": serializers.PageDetailSerializer,
        "partial_update": serializers.PageDetailSerializer,
        "blocks": serializers.BlockSerializer,
        "set_blocks": serializers.BlockSerializer,
    }

    @decorators.action(
        detail=True,
        url_path='blocks',
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        methods=["GET", "POST"],
    )
    def blocks(self, request, pk=None, **kwargs):
        page = self.get_object()

        if request.method == "GET":
            queryset = page.blocks.all().order_by('exec_order')
            serializer = self.get_serializer(instance=queryset, many=True)
            data = {"project": page.project_info, "results": serializer.data}
            return response.Response(data, status=status.HTTP_200_OK)

        else:
            data = request.data.copy()

            data["page"] = page.id

            serializer = self.get_serializer(data=data, context=page)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path='set-blocks', methods=["post"])
    def set_blocks(self, request, pk=None, **kwargs):
        page = self.get_object()
        blocks_data = request.data

        with transaction.atomic():
            for data in blocks_data:
                block = page.blocks.get(pk=data["id"])
                block.is_active = data["is_active"]
                block.exec_order = data["exec_order"]
                block.save(update_fields=["is_active", "exec_order"])

        page = self.get_object()
        page.create_dynamo_item()

        serializer = self.get_serializer(instance=page.blocks.order_by('exec_order'), many=True)

        return response.Response(serializer.data, status=status.HTTP_200_OK)


class BlockViewSet(
    utils_serializers.ActionSerializerViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        models.Block.objects.prefetch_related(
            Prefetch('images', queryset=models.BlockImage.objects.order_by('exec_order'))
        )
        .select_related("page")
        .all()
    )
    serializer_class = serializers.BlockSerializer
    permission_classes = (permissions.IsAuthenticated,)

    serializer_class_mapping = {
        "retrieve": serializers.BlockDetailSerializer,
        "update": serializers.BlockDetailSerializer,
        "partial_update": serializers.BlockDetailSerializer,
    }


class TagsListDetailViewSet(
    mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet,
):
    queryset = (
        models.TagsList.objects.all()
        .prefetch_related(Prefetch('tags', queryset=models.Tag.objects.order_by('exec_order')))
        .select_related("datasource")
    ).order_by("created")
    serializer_class = serializers.TagsListDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.datasource.project_info, "results": serializer.data}
        return response.Response(data)


class StateDetailViewSet(
    mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet,
):
    queryset = (models.State.objects.all().select_related("datasource", "author", "project")).order_by(
        "created"
    )
    serializer_class = serializers.StateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.datasource.project_info, "results": serializer.data}
        return response.Response(data)
