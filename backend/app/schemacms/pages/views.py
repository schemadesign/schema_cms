from django.db.models import Prefetch
from rest_framework import generics, permissions, response

from . import models, serializers
from ..projects.models import Project
from ..utils.views import NoListCreateDetailViewSet
from ..utils.serializers import IDNameSerializer
from ..utils.permissions import IsSchemaAdmin


class TemplateListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsSchemaAdmin)
    project_info = {}

    def get_project(self):
        project = generics.get_object_or_404(Project.objects.all(), pk=self.kwargs["project_pk"])
        self.project_info = project.project_info
        return project

    def get_queryset(self):
        return self.queryset.filter(project=self.get_project())

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.project_info, "results": serializer.data}

        return response.Response(data)

    def create(self, request, *args, **kwargs):
        if "project" not in request.data:
            request.data["project"] = kwargs["project_pk"]
        return super().create(request, *args, **kwargs)

    class Meta:
        abstract = True


class BlockTemplateListCreteView(TemplateListCreateView):
    serializer_class = serializers.BlockTemplateSerializer
    queryset = (
        models.Block.objects.filter(is_template=True)
        .select_related("project", "created_by")
        .prefetch_related(Prefetch("elements", queryset=models.BlockElement.objects.all().order_by("order")))
    )

    def list(self, request, *args, **kwargs):
        if "raw_list" in request.query_params:
            queryset = self.get_queryset()

            serializer = IDNameSerializer(queryset, many=True)
            data = {"project": self.project_info, "results": serializer.data}

            return response.Response(data)

        return super().list(request, args, kwargs)


class BlockTemplateViewSet(NoListCreateDetailViewSet):
    queryset = (
        models.Block.objects.filter(is_template=True)
        .select_related("project", "created_by")
        .prefetch_related(Prefetch("elements", queryset=models.BlockElement.objects.order_by("order")))
    )
    serializer_class = serializers.BlockTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsSchemaAdmin)


class PageTemplateListCreteView(TemplateListCreateView):
    serializer_class = serializers.PageTemplateSerializer
    queryset = (
        models.Page.objects.filter(is_template=True)
        .select_related("project", "created_by")
        .prefetch_related(
            Prefetch("pageblock_set", queryset=models.PageBlock.objects.select_related("block"))
        )
    )


class PageTemplateViewSet(NoListCreateDetailViewSet):
    queryset = (
        models.Page.objects.filter(is_template=True)
        .select_related("project", "created_by")
        .prefetch_related(
            Prefetch(
                "pageblock_set", queryset=models.PageBlock.objects.select_related("block").order_by("order")
            )
        )
    )
    serializer_class = serializers.PageTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsSchemaAdmin)
