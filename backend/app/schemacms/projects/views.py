from rest_framework import decorators, permissions, response, status, viewsets

from . import models, serializers
from ..users import permissions as user_permissions
from ..utils import serializers as utils_serializers
from ..utils.permissions import IsAdmin


class ProjectViewSet(utils_serializers.ActionSerializerViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.ProjectAccessPermission)
    queryset = models.Project.objects.none()
    serializer_class_mapping = {
        "users": serializers.UserSerializer,
    }

    def get_queryset(self):
        if self.action == "retrieve":
            queryset = models.Project.objects.all()
        else:
            queryset = models.Project.get_projects_for_user(self.request.user)

        return (
            queryset.annotate_data_source_count()
            .annotate_states_count()
            .annotate_templates_count()
            .annotate_pages_count()
            .select_related("owner")
            .prefetch_related("editors", "blocktemplate_set", "page_set")
            .order_by("-created")
        )

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

    @decorators.action(detail=True, url_path="templates", methods=["get"], permission_classes=[IsAdmin])
    def templates(self, request, **kwargs):
        project = self.get_object()

        data = {"project": project.project_info, "results": project.templates_count}

        return response.Response(data, status=status.HTTP_200_OK)
