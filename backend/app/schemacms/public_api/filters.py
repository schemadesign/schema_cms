from django_filters.rest_framework import FilterSet
from django_filters.rest_framework.filters import BaseInFilter, NumberFilter


from ..datasources.models import DataSource
from ..pages.models import Page, Section
from ..projects.models import Project


class NumberInFilter(BaseInFilter, NumberFilter):
    pass


class DataSourceFilterSet(FilterSet):
    id__in = NumberInFilter(field_name="id", lookup_expr="in")

    class Meta:
        model = DataSource
        fields = ["id", "id__in", "tags__value", "tags__category__name", "project"]


class PageFilterSet(FilterSet):
    id__in = NumberInFilter(field_name="draft_version", lookup_expr="in")
    draft_id__in = NumberInFilter(field_name="id", lookup_expr="in")

    class Meta:
        model = Page
        fields = ["id", "id__in", "draft_id__in", "tags__value", "tags__category__name"]


class ProjectFilterSet(FilterSet):
    id__in = NumberInFilter(field_name="id", lookup_expr="in")

    class Meta:
        model = Project
        fields = ["id", "id__in", "title"]


class SectionFilterSet(FilterSet):
    id__in = NumberInFilter(field_name="id", lookup_expr="in")

    class Meta:
        model = Section
        fields = ["id", "id__in", "name"]
