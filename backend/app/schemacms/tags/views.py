from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework import permissions, viewsets, response

from . import models, serializers
from ..projects.models import Project


class TagCategoryViewSet(viewsets.ModelViewSet):
    queryset = (
        models.TagCategory.objects.select_related("project")
        .prefetch_related(Prefetch("tags", queryset=models.Tag.objects.order_by("order")))
        .all()
        .order_by("name")
    )
    serializer_class = serializers.TagCategorySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        return super().get_queryset().filter(project=self.project_obj)

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.project_obj.project_info, "results": serializer.data}

        return response.Response(data)
