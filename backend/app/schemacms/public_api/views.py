import collections
import json

import django_filters.rest_framework
from django.conf import settings
from django.db.models import Prefetch
from django.shortcuts import render, get_object_or_404
from django.urls import NoReverseMatch
from rest_framework import decorators, mixins, permissions, reverse, response, renderers, views, viewsets

from . import serializers, records_reader
from ..datasources.models import DataSource, Filter
from ..pages.models import Section, Page, PageBlock, PageBlockElement, CustomElementSet
from ..projects.models import Project
from ..utils.serializers import ActionSerializerViewSetMixin


class PARootView(views.APIView):
    api_root_dict = None
    renderer_classes = [renderers.JSONRenderer]
    _ignore_model_permissions = False
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        ret = collections.OrderedDict()
        namespace = request.resolver_match.namespace
        for key, url_name in self.api_root_dict.items():
            if namespace:
                url_name = namespace + ":" + url_name
            try:
                ret[key] = (
                    settings.PUBLIC_API_URL
                    + reverse.reverse(
                        url_name, args=args, kwargs=kwargs, request=request, format=kwargs.get("format", None)
                    ).split("/")[-1]
                )
            except NoReverseMatch:
                continue

        return response.Response(ret)


class PAProjectView(
    ActionSerializerViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = serializers.PAProjectSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    serializer_class_mapping = {
        "datasources": serializers.PADataSourceListSerializer,
        "pages": serializers.PAPageDetailSerializer,
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

    @decorators.action(detail=True, url_path="pages", methods=["get"])
    def pages(self, request, **kwargs):
        pages = Page.objects.filter(section__project=self.get_object()).order_by("created")

        page = self.paginate_queryset(pages)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(pages, many=True)
        return response.Response(serializer.data)


class PASectionView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PASectionSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = (
        Section.objects.filter(is_public=True)
        .prefetch_related("pages", "pages__created_by")
        .order_by("created")
    )


class PABlocksView(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PAPageBlockSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = PageBlock.objects.prefetch_related(
        Prefetch(
            "elements",
            queryset=PageBlockElement.objects.all()
            .order_by("-order")
            .exclude(custom_element_set__isnull=False),
        )
    )

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.page_obj = self.get_page_object(kwargs["page_pk"])

    @staticmethod
    def get_page_object(page_pk):
        return get_object_or_404(Page, pk=page_pk)

    def get_queryset(self):
        return super().get_queryset().filter(page=self.page_obj)


class PAPageView(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PAPageDetailSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = (
        Page.objects.filter(is_public=True)
        .select_related("created_by")
        .prefetch_related(
            "tags",
            Prefetch(
                "pageblock_set",
                queryset=PageBlock.objects.prefetch_related(
                    Prefetch(
                        "elements",
                        queryset=PageBlockElement.objects.order_by("order").exclude(
                            custom_element_set__isnull=False
                        ),
                    )
                ).order_by("order"),
            ),
            Prefetch(
                "pageblock_set__elements__elements_sets",
                queryset=CustomElementSet.objects.prefetch_related(
                    Prefetch("elements", queryset=PageBlockElement.objects.order_by("order"))
                ).order_by("order"),
            ),
        )
        .order_by("created")
    )
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ["tags__value", "tags__category__name"]

    @decorators.action(detail=True, url_path="html", methods=["get"])
    def html(self, request, **kwargs):
        page = self.get_object()
        serializer = self.get_serializer(page)

        js = json.dumps(serializer.data)
        context = {"page": json.loads(js)}

        return render(request, "common/public_api_page.html", context)


class PADataSourceView(
    ActionSerializerViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = serializers.PADataSourceDetailNoRecordsSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = (
        DataSource.objects.select_related("active_job", "meta_data")
        .prefetch_related(Prefetch("filters", queryset=Filter.objects.filter(is_active=True)), "tags")
        .order_by("created")
    )
    serializer_class_mapping = {
        "list": serializers.PADataSourceListSerializer,
        "retrieve": serializers.PADataSourceDetailRecordsSerializer,
    }
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ["tags__value", "tags_category__name"]

    @decorators.action(detail=True, url_path="meta", methods=["get"])
    def meta(self, request, **kwargs):
        ds = self.get_object()
        serializer = self.get_serializer(ds)

        return response.Response(serializer.data["meta"])

    @decorators.action(detail=True, url_path="filters", methods=["get"])
    def filters(self, request, **kwargs):
        ds = self.get_object()
        serializer = self.get_serializer(ds)

        return response.Response(serializer.data["filters"])

    @decorators.action(detail=True, url_path="fields", methods=["get"])
    def fields(self, request, **kwargs):
        ds = self.get_object()
        serializer = self.get_serializer(ds)

        return response.Response(serializer.data["fields"])

    @decorators.action(detail=True, url_path="records", methods=["get"])
    def records(self, request, **kwargs):
        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 2000))
        columns_list_as_string = request.query_params.get("columns", None)
        orient = records_reader.get_data_format(request.query_params.get("orient", "index"))
        columns = records_reader.split_string_to_list(columns_list_as_string)

        ds = self.get_object()
        items = ds.active_job.meta_data.shape[0]

        file = records_reader.read_parquet_file(ds, columns)

        res = records_reader.get_paginated_list(file, items, page, page_size, orient)

        return response.Response(res)
