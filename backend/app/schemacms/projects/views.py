from django.db import transaction
from django.db.models import Prefetch
from rest_framework import decorators, mixins, permissions, response, status, viewsets, parsers

from . import models, serializers
from ..datasources import serializers as ds_serializers
from ..states import serializers as st_serializers
from ..users import permissions as user_permissions
from ..utils import serializers as utils_serializers


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.ProjectAccessPermission)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "datasources": ds_serializers.DataSourceSerializer,
        "folders": serializers.FolderSerializer,
        "users": serializers.UserSerializer,
        "states": st_serializers.StateSerializer,
    }

    def get_queryset(self):
        if self.action == "retrieve":
            queryset = models.Project.objects.all()
        else:
            queryset = models.Project.get_projects_for_user(self.request.user)

        return (
            queryset.annotate_data_source_count()
            .annotate_pages_count()
            .annotate_states_count()
            .select_related("owner")
            .prefetch_related("editors", "folders", "states")
            .order_by("-created")
        )

    @decorators.action(detail=True, url_path="datasources", methods=["get"])
    def datasources(self, request, **kwargs):
        project = self.get_object()

        if "raw_list" in request.query_params:
            serializer_ = serializers.DataSourceNameSerializer(project.data_sources, many=True)
            response_ = dict(project=project.project_info, results=serializer_.data)
            return response.Response(response_, status=status.HTTP_200_OK)

        queryset = (
            project.data_sources.all()
            .jobs_in_process()
            .prefetch_related("filters", "active_job__steps")
            .select_related("project", "meta_data", "created_by", "active_job")
            .annotate_filters_count()
            .annotate_tags_count()
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

    @decorators.action(detail=True, url_path="folders", methods=["get", "post"])
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

    @decorators.action(detail=True, url_path="states", methods=["get", "post"])
    def states(self, request, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="states", parent_object_name="project"
        )


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

    @decorators.action(detail=True, url_path="pages", methods=["GET", "POST"])
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
        url_path="blocks",
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        methods=["GET", "POST"],
    )
    def blocks(self, request, pk=None, **kwargs):
        page = self.get_object()

        if request.method == "GET":
            queryset = page.blocks.all().order_by("exec_order", "created")
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

    @decorators.action(detail=True, url_path="set-blocks", methods=["post"])
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

        serializer = self.get_serializer(instance=page.blocks.order_by("exec_order"), many=True)

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
            Prefetch("images", queryset=models.BlockImage.objects.order_by("exec_order"))
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
