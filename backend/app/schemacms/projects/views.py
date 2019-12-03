import json
import os

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import decorators, mixins, permissions, response, status, viewsets, generics, parsers

from schemacms.authorization import authentication
from schemacms.users import permissions as user_permissions
from schemacms.utils import serializers as utils_serializers
from . import constants, models, serializers


def update_meta(view, model_class, request, pk, *args, **kwargs):
    serializer = view.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    with transaction.atomic():
        obj = get_object_or_404(model_class.objects.select_for_update(), pk=pk)
        obj.update_meta(**serializer.validated_data)
    return response.Response(status=status.HTTP_204_NO_CONTENT)


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsAdminOrReadOnly)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "datasources": serializers.DataSourceSerializer,
        "folders": serializers.FolderSerializer,
        "users": serializers.ProjectEditorSerializer,
    }

    def get_queryset(self):
        return (
            models.Project.get_projects_for_user(self.request.user)
            .annotate_data_source_count()
            .annotate_pages_count()
            .select_related("owner")
            .prefetch_related("editors", "folders")
            .order_by("-created")
        )

    @decorators.action(detail=True, methods=["get"])
    def datasources(self, request, **kwargs):
        project = self.get_object()
        queryset = (
            project.data_sources.all()
            .jobs_in_process()
            .prefetch_related("filters")
            .select_related("project", "meta_data", "created_by", "active_job")
            .order_by("-created")
            .annotate_filters_count()
            .available_for_user(user=self.request.user)
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    @decorators.action(detail=True, url_path="users", methods=["get"])
    def users(self, request, **kwargs):
        project = self.get_object()
        editors = project.editors.all().order_by("last_name")

        page = self.paginate_queryset(editors)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(editors, many=True)
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

    @decorators.action(
        detail=True,
        permission_classes=[permissions.IsAuthenticated],
        url_path="folders",
        methods=["get", "post"],
    )
    def folders(self, request, **kwargs):
        project = self.get_object()

        if request.method == "GET":
            queryset = project.folders.select_related("created_by").all()
            serializer = self.get_serializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)

        else:
            request.data["project"] = project.id

            serializer = self.get_serializer(data=request.data, context=project)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)


class DataSourceViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.DataSourceSerializer
    queryset = (
        models.DataSource.objects.prefetch_related("filters")
        .select_related("project", "meta_data", "created_by", "active_job")
        .order_by("-created")
    )
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "script": serializers.DataSourceScriptSerializer,
        "script_upload": serializers.WranglingScriptSerializer,
        "job": serializers.CreateJobSerializer,
        "jobs_history": serializers.DataSourceJobSerializer,
        "filters": serializers.FilterSerializer,
        "set_filters": serializers.FilterSerializer,
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

    @decorators.action(detail=True, methods=["get"])
    def preview(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        if not hasattr(data_source, 'meta_data'):
            return response.Response({}, status=status.HTTP_200_OK)

        data = data_source.meta_data.data
        data["data_source"] = {"name": data_source.name}

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
            transaction.on_commit(job.schedule)
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

    @decorators.action(detail=True, url_path="fields-info", methods=["get"])
    def fields_info(self, request, pk=None, **kwargs):
        data_source = self.get_object()

        try:
            preview = data_source.current_job.meta_data.preview
        except Exception as e:
            return response.Response(f"No successful job found - {e}", status=status.HTTP_404_NOT_FOUND)

        fields = json.loads(preview.read())["fields"]

        data = dict()
        for key, value in fields.items():
            data[key] = dict(field_type=models.map_general_dtypes(value["dtype"]), unique=value["unique"])
            data[key]["filter_type"] = getattr(constants.FilterTypesGroups, data[key]["field_type"])

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
            request.data["datasource"] = data_source

            serializer = self.get_serializer(data=request.data, context=data_source)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, url_path='set-filters', methods=["post"])
    def set_filters(self, request, pk=None, **kwargs):
        data_source = self.get_object()
        active = request.data.get("active", [])
        inactive = request.data.get("inactive", [])

        data_source.filters.filter(id__in=active).update(is_active=True)
        data_source.filters.filter(id__in=inactive).update(is_active=False)

        data_source = self.get_object()
        data_source.create_meta_file()

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
    def update_meta(self, *args, **kwargs):
        return update_meta(self, models.DataSource, *args, **kwargs)


class DataSourceJobDetailViewSet(
    utils_serializers.ActionSerializerViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.DataSourceJob.objects.none()
    serializer_class = serializers.DataSourceJobSerializer
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
        "update_state": serializers.PublicApiDataSourceJobStateSerializer,
        "update_meta": serializers.PublicApiUpdateMetaSerializer,
    }

    def get_queryset(self):
        return models.DataSourceJob.objects.all().select_related("datasource").prefetch_related("steps")

    @decorators.action(detail=True, url_path="preview", methods=["get"])
    def result_preview(self, request, pk=None, **kwarg):
        obj = self.get_object()
        try:
            if not hasattr(obj, 'meta_data') and obj.result:
                obj.update_meta()
            result = obj.meta_data.data
        except Exception as e:
            return response.Response(str(e), status=status.HTTP_404_NOT_FOUND)

        return response.Response(result, status=status.HTTP_200_OK)

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
    def update_meta(self, *args, **kwargs):
        return update_meta(self, models.DataSourceJob, *args, **kwargs)


class DataSourceScriptDetailView(generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = models.WranglingScript.objects.none()
    serializer_class = serializers.WranglingScriptSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.WranglingScript.objects.all().select_related("datasource", "created_by")


class FilterDetailViewSet(
    mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    queryset = models.Filter.objects.none()
    serializer_class = serializers.FilterSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.Filter.objects.all().select_related("datasource")


class FolderViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Folder.objects.select_related("project", "created_by").all()
    serializer_class = serializers.FolderSerializer
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class_mapping = {
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
            return response.Response(serializer.data, status=status.HTTP_200_OK)

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

    @decorators.action(detail=True, url_path='blocks', methods=["GET", "POST"])
    def blocks(self, request, pk=None, **kwargs):
        page = self.get_object()

        if request.method == "GET":
            queryset = page.blocks.select_related("page").all()
            serializer = self.get_serializer(instance=queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)

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
        active = request.data.get("active", [])
        inactive = request.data.get("inactive", [])

        page.blocks.filter(id__in=active).update(is_active=True)
        page.blocks.filter(id__in=inactive).update(is_active=False)

        page = self.get_object()

        serializer = self.get_serializer(instance=page.blocks, many=True)

        return response.Response(serializer.data, status=status.HTTP_200_OK)


class BlockViewSet(
    utils_serializers.ActionSerializerViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.Block.objects.select_related("page").all()
    serializer_class = serializers.BlockSerializer
    permission_classes = (permissions.IsAuthenticated,)

    serializer_class_mapping = {
        "retrieve": serializers.BlockDetailSerializer,
        "update": serializers.BlockDetailSerializer,
        "partial_update": serializers.BlockDetailSerializer,
    }
