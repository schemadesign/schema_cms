import django_filters.rest_framework
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import decorators, generics, filters, mixins, permissions, response, status, viewsets

from . import models, serializers, constants
from ..projects.models import Project
from ..utils.permissions import IsAdmin, IsAdminOrIsEditor, IsAdminOrReadOnly
from ..utils.serializers import IDNameSerializer, ActionSerializerViewSetMixin
from ..utils.views import DetailViewSet


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
            Prefetch("elements", queryset=models.BlockTemplateElement.objects.all().order_by("order"))
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
        Prefetch("elements", queryset=models.BlockTemplateElement.objects.order_by("order"))
    )
    serializer_class = serializers.BlockTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    @decorators.action(detail=True, url_path="copy", methods=["post"])
    def copy_block(self, request, **kwargs):
        block = self.get_object()
        copy_time = timezone.now().strftime("%Y-%m-%d, %H:%M:%S.%f")

        try:
            new_block = block.make_clone(attrs={"name": f"Block Template ID #{block.id} copy({copy_time})"})
        except Exception as e:
            return response.Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

        return response.Response({"id": new_block.id}, status=status.HTTP_200_OK)


class PageTemplateListCreteView(BaseListCreateView):
    serializer_class = serializers.PageTemplateSerializer
    queryset = (
        models.PageTemplate.objects.all()
        .order_by("-created")
        .select_related("project", "created_by")
        .prefetch_related(
            Prefetch(
                "page_blocks",
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
            Prefetch(
                "page_blocks",
                queryset=models.PageBlock.objects.prefetch_related("block__elements")
                .select_related("block")
                .order_by("order"),
            ),
        )
    )
    serializer_class = serializers.PageTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

    @decorators.action(detail=True, url_path="copy", methods=["post"])
    def copy_template(self, request, **kwargs):
        template = self.get_object()

        try:
            new_page = template.copy_template()
        except Exception as e:
            return response.Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

        return response.Response({"id": new_page.id}, status=status.HTTP_200_OK)


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
    queryset = models.Section.objects.all().annotate_pages_count().select_related("project", "created_by")
    serializer_class = serializers.SectionDetailSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)

    def get_queryset(self):
        pages_order = self.request.query_params.get("pages_order")

        if pages_order:
            return (
                super()
                .get_queryset()
                .prefetch_related(Prefetch("pages", queryset=models.Page.objects.all().order_by(pages_order)))
            )

        return super().get_queryset().prefetch_related("pages")


class PageListCreateView(
    ActionSerializerViewSetMixin, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    permission_classes = (permissions.IsAuthenticated, IsAdminOrIsEditor)
    serializer_class = serializers.PageListSerializer
    serializer_class_mapping = {
        "list": serializers.PageListSerializer,
        "create": serializers.PageCreateSerializer,
    }
    queryset = (
        models.Page.objects.all()
        .select_related("project", "created_by", "template", "section")
        .prefetch_related(Prefetch("tags", queryset=models.PageTag.objects.select_related("category")))
        .filter(is_draft=True)
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
            Prefetch("page_blocks", queryset=models.PageBlock.objects.select_related("block")),
            Prefetch("tags", queryset=models.PageTag.objects.select_related("category")),
        )
    )

    serializer_class = serializers.PageDetailSerializer
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

    @decorators.action(detail=True, url_path="copy", methods=["post"])
    def copy_page(self, request, **kwargs):
        page = self.get_object()

        try:
            new_page = page.copy_page()
        except Exception as e:
            return response.Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

        return response.Response({"id": new_page.id}, status=status.HTTP_200_OK)

    @decorators.action(detail=True, url_path="publish", methods=["get"])
    def publish(self, request, **kwargs):
        page = self.get_object()

        try:
            if page.published_version.state in [
                constants.PageState.DRAFT,
                constants.PageState.WAITING_TO_REPUBLISH,
            ]:
                page.publish()
                page.save()

        except Exception as e:
            return response.Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

        return response.Response({"message": f"Page {page.id} published"}, status=status.HTTP_200_OK)
