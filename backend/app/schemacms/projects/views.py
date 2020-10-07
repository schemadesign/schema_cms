import django_filters.rest_framework
from django.db.models import Prefetch
from rest_framework import decorators, filters, permissions, response, status, viewsets

from . import models, serializers
from ..pages.models import Section, PageTemplate, PageBlock, Page
from ..pages.serializers import SectionInternalConnectionSerializer, PageTemplateSerializer
from ..pages.constants import PageState
from ..states.models import State
from ..states.serializers import StatePageAdditionalDataSerializer
from ..tags.models import Tag, TagCategory
from ..tags.serializers import TagCategorySerializer
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
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["created", "modified", "title"]

    def get_queryset(self):
        if self.action == "retrieve":
            queryset = models.Project.objects.all()
        else:
            queryset = models.Project.get_projects_for_user(self.request.user)

        return (
            queryset.annotate_data_source_count()
            .annotate_states_count()
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

    @decorators.action(detail=True, url_path="page-additional-data", methods=["get"])
    def page_additional_data(self, request, **kwargs):
        project = self.get_object()

        sections = (
            Section.objects.filter(project=project)
            .select_related("project", "created_by", "main_page")
            .prefetch_related(Prefetch("pages", queryset=Page.objects.filter(is_draft=False, state__in=[PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH])))
            .order_by("-created")
        )

        tags = (
            TagCategory.objects.filter(project=project, type__content=True)
            .select_related("project", "created_by")
            .prefetch_related(Prefetch("tags", queryset=Tag.objects.order_by("order")))
            .order_by("name")
        )

        templates_filter_kwargs = {"project": project}

        if request.user.is_editor:
            templates_filter_kwargs["is_available"] = True

        page_templates = (
            PageTemplate.objects.filter(**templates_filter_kwargs)
            .order_by("-created")
            .select_related("project", "created_by")
            .prefetch_related(
                Prefetch(
                    "page_blocks",
                    queryset=PageBlock.objects.prefetch_related("block__elements")
                    .select_related("block")
                    .order_by("order"),
                )
            )
        )

        states = State.objects.filter(datasource__project=project, is_public=True).only(
            "id", "name", "datasource"
        )

        states_data = StatePageAdditionalDataSerializer(states, many=True).data
        section_data = SectionInternalConnectionSerializer(sections, many=True).data
        tags_data = TagCategorySerializer(tags, many=True).data
        page_templates_data = PageTemplateSerializer(page_templates, many=True).data

        data = {
            "internal_connections": section_data,
            "tag_categories": tags_data,
            "page_templates": page_templates_data,
            "states": states_data,
        }

        return response.Response(data, status=status.HTTP_200_OK)
