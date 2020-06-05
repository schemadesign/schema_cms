from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import filters, permissions, viewsets, response, mixins

from . import models, serializers
from .permissions import TagPermission
from ..projects.models import Project


class BaseTagCategoryView:
    serializer_class = serializers.TagCategorySerializer
    permission_classes = (permissions.IsAuthenticated, TagPermission)
    queryset = (
        models.TagCategory.objects.select_related("project", "created_by")
        .prefetch_related(Prefetch("tags", queryset=models.Tag.objects.order_by("order")))
        .all()
        .order_by("name")
    )


class TagCategoryListCreateViewSet(
    BaseTagCategoryView, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created", "modified", "name"]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        category_type = self.request.query_params.get("type", None)

        if category_type:
            filter_kwargs = {f"type__{category_type}": True}
            queryset = super().get_queryset().filter(project=self.project_obj, **filter_kwargs)
        else:
            queryset = super().get_queryset().filter(project=self.project_obj)

        if self.request.user.is_editor:
            queryset = queryset.filter(is_available=True)

        return queryset

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)

    def list(self, request, *args, **kwargs):
        res = super().list(request, args, kwargs)
        res.data["project"] = self.project_obj.project_info

        return res

    def create(self, request, *args, **kwargs):
        request.data["project"] = self.project_obj.id

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TagCategoryDetailsViewSet(
    BaseTagCategoryView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.project.project_info, "results": serializer.data}

        return response.Response(data)
