from django.db.models import Prefetch
from rest_framework import decorators, viewsets, response, mixins
from django.shortcuts import render
from . import serializers
from ..projects.models import Project
from ..pages.models import Section, Page
from ..utils.serializers import ActionSerializerViewSetMixin


class PAProjectView(
    ActionSerializerViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = serializers.PAProjectSerializer
    permission_classes = ()
    serializer_class_mapping = {
        "datasources": serializers.PADataSourceSerializer,
    }
    queryset = (
        Project.objects.select_related("owner",)
        .prefetch_related(
            "data_sources",
            Prefetch("sections", queryset=Section.objects.prefetch_related("pages")),
            "sections__pages__created_by",
        )
        .all()
        .order_by("id")
    )

    @decorators.action(detail=True, url_path="datasources", methods=["get"])
    def datasources(self, request, **kwargs):
        data_sources = self.get_object().data_sources.all().order_by("created")

        page = self.paginate_queryset(data_sources)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(data_sources, many=True)
        return response.Response(serializer.data)


class PASectionView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PASectionSerializer
    permission_classes = ()
    queryset = (
        Section.objects.filter(is_public=True)
        .prefetch_related("pages", "pages__created_by")
        .order_by("created")
    )


class PAPageView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PAPageDetailSerializer
    permission_classes = ()
    queryset = Page.objects.filter(is_public=True).select_related("created_by").order_by("created")

    @decorators.action(detail=True, url_path="html", methods=["get"])
    def html(self, request, **kwargs):
        page = self.get_object()
        serializer = self.get_serializer(page)

        context = {"page": serializer.data}
        return render(request, "common/public_api_page.html", context)
