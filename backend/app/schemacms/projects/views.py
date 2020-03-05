from rest_framework import decorators, permissions, response, status, viewsets

from . import models, serializers
from ..datasources import serializers as ds_serializers
from ..states import serializers as st_serializers
from ..pages import serializers as pages_serializers
from ..users import permissions as user_permissions
from ..utils import serializers as utils_serializers


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.ProjectAccessPermission)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "datasources": ds_serializers.DataSourceSerializer,
        "users": serializers.UserSerializer,
        "states": st_serializers.StateSerializer,
        "block_templates": pages_serializers.BlockTemplateSerializer,
        "page_templates": pages_serializers.PageTemplateSerializer,
    }

    def get_queryset(self):
        if self.action == "retrieve":
            queryset = models.Project.objects.all()
        elif self.action == "block_templates":
            return models.Project.objects.all().prefetch_related(
                "blocktemplate_set", "blocktemplate_set__elements"
            )
        else:
            queryset = models.Project.get_projects_for_user(self.request.user)

        return (
            queryset.annotate_data_source_count()
            .annotate_states_count()
            .annotate_templates_count()
            .select_related("owner")
            .prefetch_related("editors", "states", "blocktemplate_set", "pagetemplate_set")
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

    @decorators.action(detail=True, url_path="states", methods=["get", "post"])
    def states(self, request, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="states", parent_object_name="project"
        )

    @decorators.action(detail=True, url_path="templates", methods=["get"])
    def templates(self, request, **kwargs):
        project = self.get_object()

        data = {"project": project.project_info, "results": project.templates_count}

        return response.Response(data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path="block-templates", methods=["get", "post"])
    def block_templates(self, request, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="blocktemplate_set", parent_object_name="project"
        )

    @decorators.action(detail=True, url_path="page-templates", methods=["get", "post"])
    def page_templates(self, request, **kwargs):
        return self.generate_action_post_get_response(
            request, related_objects_name="pagetemplate_set", parent_object_name="project"
        )
