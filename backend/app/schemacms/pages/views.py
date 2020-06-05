from django.db import models as d_models
from django.shortcuts import get_object_or_404

import django_filters.rest_framework

from rest_framework import generics, filters, mixins, permissions, response, viewsets

from . import models, serializers
from ..projects.models import Project
from ..utils.views import DetailViewSet
from ..utils.serializers import IDNameSerializer
from ..utils.permissions import IsAdmin, IsAdminOrIsEditor, IsAdminOrReadOnly


class BaseListCreateView(generics.ListCreateAPIView):
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created", "modified", "name"]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        if self.request.user.is_editor:
            return super().get_queryset().filter(project=self.project_obj, is_available=True)
        return super().get_queryset().filter(project=self.project_obj)

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)

    def create(self, request, *args, **kwargs):
        if "project" not in request.data:
            request.data["project"] = kwargs["project_pk"]
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        res = super().list(request, args, kwargs)
        res.data["project"] = self.project_obj.project_info

        return res


class BlockTemplateListCreteView(BaseListCreateView):
    serializer_class = serializers.BlockTemplateSerializer
    queryset = (
        models.BlockTemplate.objects.select_related("project", "created_by")
        .prefetch_related(
            d_models.Prefetch(
                "elements", queryset=models.BlockTemplateElement.objects.all().order_by("order")
            )
        )
        .order_by("-created")
    )
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly)

    def list(self, request, *args, **kwargs):
        if "raw_list" in request.query_params:
            queryset = self.get_queryset()

            serializer = IDNameSerializer(queryset, many=True)
            data = {"results": serializer.data}

            return response.Response(data)

        return super().list(request, args, kwargs)


class BlockTemplateViewSet(DetailViewSet):
    queryset = models.BlockTemplate.objects.select_related("project", "created_by").prefetch_related(
        d_models.Prefetch("elements", queryset=models.BlockTemplateElement.objects.order_by("order"))
    )
    serializer_class = serializers.BlockTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)


class PageTemplateListCreteView(BaseListCreateView):
    serializer_class = serializers.PageTemplateSerializer
    queryset = (
        models.PageTemplate.objects.all()
        .order_by("-created")
        .select_related("project", "created_by")
        .prefetch_related(
            d_models.Prefetch(
                "pageblock_set",
                queryset=models.PageBlock.objects.prefetch_related("block__elements")
                .select_related("block")
                .order_by("order"),
            ),
        )
    )
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly)


class PageTemplateViewSet(DetailViewSet):
    queryset = (
        models.PageTemplate.objects.all()
        .select_related("project", "created_by")
        .prefetch_related(
            d_models.Prefetch(
                "pageblock_set",
                queryset=models.PageBlock.objects.prefetch_related("block__elements")
                .select_related("block")
                .order_by("order"),
            ),
        )
    )
    serializer_class = serializers.PageTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)


class SectionListCreateView(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = (
        models.Section.objects.all()
        .annotate_pages_count()
        .select_related("project", "created_by")
        .prefetch_related("pages")
        .order_by("-created")
    )
    serializer_class = serializers.SectionListCreateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)

    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["created", "modified", "name"]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        return super().get_queryset().filter(project=self.project_obj)

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        res = super().list(request, args, kwargs)
        res.data["project"] = self.project_obj.project_info

        return res

    def create(self, request, *args, **kwargs):
        request.data["project"] = kwargs["project_pk"]

        return super().create(request, *args, **kwargs)


class SectionInternalConnectionView(generics.ListAPIView):
    queryset = (
        models.Section.objects.all()
        .select_related("project", "created_by", "main_page")
        .prefetch_related("pages")
        .order_by("-created")
    )
    serializer_class = serializers.SectionInternalConnectionSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)
    project_info = {}

    def get_parent(self):
        project = generics.get_object_or_404(Project.objects.all(), pk=self.kwargs["project_pk"])
        self.project_info = project.project_info
        return project

    def get_queryset(self):
        return self.queryset.filter(project=self.get_parent())

    def list(self, request, *args, **kwargs):
        if (
            self.serializer_class != serializers.SectionInternalConnectionSerializer
            and request.user.is_editor
        ):
            queryset = self.get_queryset().filter(is_available=True)
        else:
            queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.project_info, "results": serializer.data}

        return response.Response(data)


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
    serializer_class = serializers.PageSerializer
    queryset = (
        models.Page.objects.all()
        .select_related("project", "created_by", "template", "section")
        .prefetch_related(
            d_models.Prefetch(
                "pageblock_set", queryset=models.PageBlock.objects.select_related("block").order_by("order")
            )
        )
        .order_by("-created")
    )
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created", "modified", "name"]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.section_obj = self.get_section_object(kwargs["section_pk"])

    @staticmethod
    def get_section_object(section_pk):
        return get_object_or_404(models.Section, pk=section_pk)

    def get_queryset(self):
        return super().get_queryset().filter(section=self.section_obj)

    def list(self, request, *args, **kwargs):
        res = super().list(request, args, kwargs)
        res.data["project"] = self.section_obj.project.project_info

        return res

    def create(self, request, *args, **kwargs):
        request.data["section"] = kwargs["section_pk"]

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, is_template=False, project=self.section_obj.project)


class PageViewSet(DetailViewSet):
    queryset = (
        models.Page.objects.all()
        .select_related("project", "created_by", "template", "section")
        .prefetch_related(
            d_models.Prefetch("pageblock_set", queryset=models.PageBlock.objects.select_related("block"))
        )
    )

    serializer_class = serializers.PageSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)

    def perform_destroy(self, instance):
        section = instance.section
        current_pages = list(section.pages.values_list("id", flat=True))
        current_pages.remove(instance.id)

        if section.main_page == instance:
            instance.delete()
            section.deleted_at = None
            section.main_page = None
            section.save()
            section.pages.all_with_deleted().filter(id__in=current_pages).update(deleted_at=None)
        else:
            super().perform_destroy(instance)
