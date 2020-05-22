from django.shortcuts import get_object_or_404
from rest_framework import permissions, response, viewsets, mixins

from . import models, serializers
from ..datasources.models import DataSource


class BaseStateView:
    serializer_class = serializers.StateSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = (
        models.State.objects.select_related("datasource", "author")
        .prefetch_related("tags")
        .order_by("created")
    )


class StateListCreateView(
    BaseStateView, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.datasource_obj = self.get_datasource_object(kwargs["datasource_pk"])

    def get_queryset(self):
        return super().get_queryset().filter(datasource=self.datasource_obj)

    @staticmethod
    def get_datasource_object(datasource_pk):
        return get_object_or_404(DataSource, pk=datasource_pk)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        data = {"project": self.datasource_obj.project_info, "results": serializer.data}

        return response.Response(data)

    def create(self, request, *args, **kwargs):
        request.data["datasource"] = self.datasource_obj.id

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class StateDetailViewSet(
    BaseStateView,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.datasource.project_info, "results": serializer.data}

        return response.Response(data)
