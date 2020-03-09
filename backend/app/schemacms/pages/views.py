from django.db.models import Prefetch
from rest_framework import permissions

from . import models, serializers
from ..utils.views import NoListCreateDetailViewSet
from ..utils.permissions import IsSchemaAdmin


class BlockTemplateViewSet(NoListCreateDetailViewSet):
    queryset = (
        models.BlockTemplate.objects.all()
        .select_related("project")
        .prefetch_related(
            Prefetch("elements", queryset=models.BlockTemplateElement.objects.order_by("order"))
        )
    )
    serializer_class = serializers.BlockTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsSchemaAdmin)


class PageTemplateViewSet(NoListCreateDetailViewSet):
    queryset = (
        models.PageTemplate.objects.all()
        .select_related("project")
        .prefetch_related(Prefetch("blocks", queryset=models.BlockTemplate.objects.all()))
    )
    serializer_class = serializers.PageTemplateSerializer
    permission_classes = (permissions.IsAuthenticated, IsSchemaAdmin)
