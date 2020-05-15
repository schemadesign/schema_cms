from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, response, mixins

from . import models, serializers
from ..projects.models import Project


class BaseTagCategoryView:
    serializer_class = serializers.TagCategorySerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = (
        models.TagCategory.objects.select_related("project", "created_by")
        .prefetch_related(Prefetch("tags", queryset=models.Tag.objects.order_by("order")))
        .all()
        .order_by("name")
    )


class TagCategoryListCreateViewSet(
    BaseTagCategoryView, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        return super().get_queryset().filter(project=self.project_obj)

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)

    def list(self, request, *args, **kwargs):
        category_type = request.query_params.get("type", None)

        if category_type:
            filter_kwargs = {f"type__{category_type}": True}
            queryset = self.get_queryset().filter(**filter_kwargs)
        else:
            queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.project_obj.project_info, "results": serializer.data}

        return response.Response(data)

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
