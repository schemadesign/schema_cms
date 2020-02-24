from django.db.models import Prefetch
from rest_framework import mixins, permissions, response, viewsets

from . import models, serializers


class TagsListDetailViewSet(
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        models.TagsList.objects.all()
        .prefetch_related(
            Prefetch("tags", queryset=models.Tag.objects.order_by("exec_order"))
        )
        .select_related("datasource")
    ).order_by("created")
    serializer_class = serializers.TagsListDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.datasource.project_info, "results": serializer.data}
        return response.Response(data)


class StateDetailViewSet(
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        models.State.objects.all()
        .select_related("datasource", "author", "project")
        .order_by("created")
    )
    serializer_class = serializers.StateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.datasource.project_info, "results": serializer.data}
        return response.Response(data)
