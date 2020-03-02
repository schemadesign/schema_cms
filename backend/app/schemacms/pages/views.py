from rest_framework import permissions

from . import models, serializers
from ..utils.views import NoListCreateDetailViewSet


class BlockTemplateViewSet(NoListCreateDetailViewSet):
    queryset = models.BlockTemplate.objects.all().select_related("project").prefetch_related("elements")
    serializer_class = serializers.BlockTemplateSerializer
    permission_classes = (permissions.IsAuthenticated,)


class PageTemplateViewSet(NoListCreateDetailViewSet):
    queryset = models.PageTemplate.objects.all().select_related("project")
    serializer_class = serializers.PageTemplateSerializer
    permission_classes = (permissions.IsAuthenticated,)
