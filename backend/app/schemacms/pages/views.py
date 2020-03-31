from django.db.models import Prefetch
from rest_framework import generics, permissions, response

from . import models, serializers
from ..projects.models import Project
from ..utils.views import DetailViewSet
from ..utils.serializers import IDNameSerializer
from ..utils.permissions import IsAdmin, IsAdminOrIsEditor, IsAdminOrReadOnly


class TemplateListCreateView(generics.ListCreateAPIView):
    project_info = {}

    def get_parent(self):
        project = generics.get_object_or_404(Project.objects.all(), pk=self.kwargs["project_pk"])
        self.project_info = project.project_info
        return project

    def get_queryset(self):
        return self.queryset.filter(project=self.get_parent())

    def list(self, request, *args, **kwargs):
        if self.serializer_class != serializers.SectionListCreateSerializer and request.user.is_editor:
            queryset = self.get_queryset().filter(is_available=True)
        else:
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
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly)

    def list(self, request, *args, **kwargs):
        if "raw_list" in request.query_params:
            queryset = self.get_queryset()

            serializer = IDNameSerializer(queryset, many=True)
            data = {"project": self.project_info, "results": serializer.data}

            return response.Response(data)

        return super().list(request, args, kwargs)


class BlockTemplateViewSet(DetailViewSet):
    queryset = (
        models.Block.objects.filter(is_template=True)
        .select_related("project", "created_by")
        .prefetch_related(Prefetch("elements", queryset=models.BlockElement.objects.order_by("order")))
    )
    serializer_class = serializers.BlockTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)


class PageTemplateListCreteView(TemplateListCreateView):
    serializer_class = serializers.PageTemplateSerializer
    queryset = (
        models.PageTemplate.objects.all()
        .order_by("-created")
        .select_related("project", "created_by")
        .prefetch_related(
            Prefetch(
                "pageblock_set",
                queryset=models.PageBlock.objects.prefetch_related("block__elements").select_related("block"),
            ),
        )
    )
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly)


class PageTemplateViewSet(DetailViewSet):
    queryset = (
        models.PageTemplate.objects.all()
        .select_related("project", "created_by")
        .prefetch_related(
            Prefetch(
                "pageblock_set",
                queryset=models.PageBlock.objects.prefetch_related("block__elements").select_related("block"),
            ),
        )
    )
    serializer_class = serializers.PageTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)


class SectionListCreateView(TemplateListCreateView):
    queryset = (
        models.Section.objects.all()
        .annotate_pages_count()
        .select_related("project", "created_by")
        .prefetch_related("pages")
        .order_by("-created")
    )
    serializer_class = serializers.SectionListCreateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)
    project_info = {}

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SectionViewSet(DetailViewSet):
    queryset = (
        models.Section.objects.all()
        .annotate_pages_count()
        .select_related("project", "created_by")
        .prefetch_related("pages")
    )
    serializer_class = serializers.SectionDetailSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)


class PageListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)
    project_info = {}
    serializer_class = serializers.PageSerializer
    queryset = (
        models.Page.objects.all()
        .select_related("project", "created_by", "template", "section")
        .prefetch_related(
            Prefetch("pageblock_set", queryset=models.PageBlock.objects.select_related("block"))
        )
        .order_by("-created")
    )

    def get_parent(self):
        section = generics.get_object_or_404(models.Section.objects.all(), pk=self.kwargs["section_pk"])
        self.project_info = section.project.project_info
        return section

    def get_queryset(self):
        return self.queryset.filter(section=self.get_parent())

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.project_info, "results": serializer.data}

        return response.Response(data)

    def create(self, request, *args, **kwargs):
        if "sections" not in request.data:
            request.data["section"] = kwargs["section_pk"]
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, is_template=False)


class PageViewSet(DetailViewSet):
    queryset = (
        models.Page.objects.all()
        .select_related("project", "created_by", "template", "section")
        .prefetch_related(
            Prefetch(
                "pageblock_set", queryset=models.PageBlock.objects.select_related("block").order_by("order")
            )
        )
    )
    serializer_class = serializers.PageSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)
