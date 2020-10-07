import collections
import json

from django.conf import settings
from django.db.models import Prefetch
from django.shortcuts import render, get_object_or_404
from django.urls import NoReverseMatch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import (
    decorators,
    filters as drf_filters,
    mixins,
    permissions,
    reverse,
    response,
    renderers,
    views,
    viewsets,
)

from . import filters, serializers, records_reader
from ..datasources.models import DataSource, Filter
from ..pages.models import Section, Page, PageBlock, PageBlockElement
from ..pages.constants import PageState
from ..projects.models import Project
from ..tags.models import TagCategory
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


class TagCategoryListView(mixins.ListModelMixin, viewsets.GenericViewSet):
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = TagCategory.objects.prefetch_related("tags").select_related("project").order_by("name")
    serializer_class = serializers.PATagCategorySerializer
    filter_backends = [drf_filters.OrderingFilter]
    ordering_fields = ["created", "modified", "name"]

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.project_obj = self.get_project_object(kwargs["project_pk"])

    def get_queryset(self):
        return super().get_queryset().filter(project=self.project_obj)

    @staticmethod
    def get_project_object(project_pk):
        return get_object_or_404(Project, pk=project_pk)


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
    page_select_related_fields = ["created_by", "published_version", "draft_version", "template"]
    queryset = (
        Project.objects.select_related("owner")
        .prefetch_related(
            Prefetch("data_sources", queryset=DataSource.objects.all().order_by("-created")),
            Prefetch(
                "sections",
                queryset=Section.objects.filter(is_public=True).prefetch_related(
                    Prefetch(
                        "pages",
                        queryset=Page.objects.select_related(*page_select_related_fields).filter(
                            is_public=True
                        ),
                    )
                ),
            ),
        )
        .all()
        .order_by("id")
    )
    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter]
    filterset_class = filters.ProjectFilterSet
    ordering_fields = ["created", "modified", "title"]

    @decorators.action(detail=True, url_path="datasources", methods=["get"])
    def datasources(self, request, **kwargs):
        ordering = request.query_params.get("ordering", "-created")

        if ordering not in ["created", "modified", "name", "-created", "-modified", "-name"]:
            ordering = "-created"

        data_sources = self.get_object().data_sources.all().order_by(ordering)

        page = self.paginate_queryset(data_sources)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(data_sources, many=True)
        return response.Response(serializer.data)

    @decorators.action(detail=True, url_path="pages", methods=["get"])
    def pages(self, request, **kwargs):
        ordering = request.query_params.get("ordering")
        show_drafts = self.request.query_params.get("show_drafts")

        if ordering not in ["created", "modified", "name", "-created", "-modified", "-name"]:
            ordering = "-created"

        pages = Page.objects.filter(
            section__project=self.get_object(),
            section__is_public=True,
            is_public=True,
            state__in=[PageState.DRAFT]
            if show_drafts == "true"
            else [PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH],
            is_draft=True if show_drafts == "true" else False,
        ).order_by(ordering)

        page = self.paginate_queryset(pages)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(pages, many=True)
        return response.Response(serializer.data)


class PASectionView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PASectionDetailSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = Section.objects.filter(is_public=True).prefetch_related("pages").order_by("created")

    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter]
    filterset_class = filters.SectionFilterSet
    ordering_fields = ["created", "modified", "name"]


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
    queryset = Page.objects.select_related("created_by").prefetch_related("tags").order_by("created")
    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter]
    filterset_class = filters.PageFilterSet
    ordering_fields = ["created", "modified", "name"]

    def get_queryset(self):
        if self.action == "list":
            show_drafts = self.request.query_params.get("show_drafts")
            self.queryset = self.queryset.filter(
                is_public=True,
                is_draft=True if show_drafts == "true" else False,
                state__in=[PageState.DRAFT]
                if show_drafts == "true"
                else [PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH],
            )

        if self.action in ["retrieve", "html"]:
            self.queryset = self.queryset.filter(
                is_public=True,
                is_draft=True,
                published_version__state__in=[PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH],
            )

        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object().published_version
        serializer = self.get_serializer(instance)

        return response.Response(serializer.data)

    @decorators.action(detail=True, url_path="html", methods=["get"])
    def html(self, request, **kwargs):
        page = self.get_object().published_version
        serializer = self.get_serializer(page)

        js = json.dumps(serializer.data)
        context = {"page": json.loads(js)}

        return render(request, "common/public_api_page.html", context)

    @decorators.action(detail=True, url_path="draft", methods=["get"])
    def draft(self, request, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return response.Response(serializer.data)


class PADataSourceView(
    ActionSerializerViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = serializers.PADataSourceDetailNoRecordsSerializer
    renderer_classes = [renderers.JSONRenderer]
    permission_classes = ()
    queryset = (
        DataSource.objects.select_related("meta_data")
        .prefetch_related(Prefetch("filters", queryset=Filter.objects.filter(is_active=True)), "tags")
        .order_by("created")
    )
    serializer_class_mapping = {
        "list": serializers.PADataSourceListSerializer,
        "retrieve": serializers.PADataSourceDetailRecordsSerializer,
    }
    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter]
    filterset_class = filters.DataSourceFilterSet
    ordering_fields = ["created", "modified", "name"]

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

        if page == 0:
            page = 1

        page_size = int(request.query_params.get("page_size", 2000))
        columns_list_as_string = request.query_params.get("columns", None)
        orient = records_reader.get_data_format(request.query_params.get("orient", "index"))
        columns = records_reader.split_string_to_list(columns_list_as_string)

        ds = self.get_object()
        job = ds.get_active_job()

        items = job.meta_data.shape[0]

        fields_names = job.meta_data.fields_names
        filters = records_reader.set_filters(request.query_params, fields_names)
        filter_query = records_reader.create_query_string(filters)

        file = records_reader.read_parquet_file(ds, columns)

        res = records_reader.get_paginated_list(file, items, page, page_size, orient, filter_query)

        return response.Response(res)
