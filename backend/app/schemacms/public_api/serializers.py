import json

from django.db.models import Prefetch
from rest_framework import serializers

from ..projects import models as pr_models
from ..datasources import models as ds_models
from ..pages import models as pa_models
from ..pages.constants import ElementType
from . import utils, records_reader


element_to_html_function = {
    ElementType.PLAIN_TEXT: lambda: utils.plain_text_in_html,
    ElementType.MARKDOWN: lambda: utils.markdown_in_html,
    ElementType.CODE: lambda: utils.code_in_html,
    ElementType.CONNECTION: lambda: utils.connection_in_html,
    ElementType.INTERNAL_CONNECTION: lambda: utils.internal_connection_in_html,
    ElementType.OBSERVABLE_HQ: lambda: utils.observable_in_html,
    ElementType.IMAGE: lambda: utils.image_in_html,
    ElementType.CUSTOM_ELEMENT: lambda: utils.custom_in_html,
}


class PAFilterSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="filter_type")

    class Meta:
        model = ds_models.Filter
        fields = ("id", "name", "type", "field")


class PADataSourceListSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = ds_models.DataSource
        fields = ("id", "type", "name", "tags")

    def get_tags(self, obj):
        return [tag.value for tag in obj.tags.all()]


class PADataSourceDetailNoRecordsSerializer(serializers.ModelSerializer):
    meta = serializers.SerializerMethodField()
    shape = serializers.SerializerMethodField()
    fields = serializers.SerializerMethodField(method_name="get_ds_fields")
    filters = PAFilterSerializer(read_only=True, many=True)
    tags = serializers.SerializerMethodField()

    class Meta:
        model = ds_models.DataSource
        fields = ("meta", "shape", "fields", "filters", "tags")

    def get_meta(self, obj):
        return {
            "id": obj.id,
            "name": obj.name,
            "created_by": obj.created_by.get_full_name(),
            "created": obj.created.strftime("%Y-%m-%d"),
            "updated": obj.modified.strftime("%Y-%m-%d"),
        }

    def get_shape(self, obj):
        return obj.active_job.meta_data.shape

    def get_ds_fields(self, obj):
        fields = json.loads(obj.active_job.meta_data.preview.read())["fields"]
        data = {
            str(num): {"name": key, "type": value["dtype"]} for num, (key, value) in enumerate(fields.items())
        }
        return data

    def get_tags(self, obj):
        return [tag.value for tag in obj.tags.all()]


class PADataSourceDetailRecordsSerializer(PADataSourceDetailNoRecordsSerializer):
    records = serializers.SerializerMethodField()

    class Meta(PADataSourceDetailNoRecordsSerializer.Meta):
        fields = PADataSourceDetailNoRecordsSerializer.Meta.fields + ("records",)

    def get_records(self, obj):
        return records_reader.read_records_preview(obj)


class PABlockElementSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()
    html = serializers.SerializerMethodField()

    class Meta:
        model = pa_models.PageBlockElement
        fields = ("id", "name", "type", "order", "value", "html")

    def get_value(self, obj):
        if obj.type == ElementType.IMAGE:
            return {"file_name": obj.get_original_file_name()[1], "image": obj.image.url}

        if obj.type == ElementType.OBSERVABLE_HQ:
            return obj.observable_hq.as_dict()

        if obj.type == ElementType.CUSTOM_ELEMENT:
            return self.custom_element_data(obj)

        return getattr(obj, obj.type)

    def get_html(self, obj):
        if obj.type == ElementType.CUSTOM_ELEMENT:
            return element_to_html_function[obj.type]()(obj.id, self.custom_element_data(obj))
        return element_to_html_function[obj.type]()(obj)

    @staticmethod
    def custom_element_data(custom_element):
        elements = []

        for element_set in custom_element.elements_sets.order_by("order"):
            data = {
                "id": element_set.id,
                "order": element_set.order,
                "elements": PABlockElementSerializer(element_set.elements.order_by("order"), many=True).data,
            }
            elements.append(data)

        return elements


class PAPageBlockSerializer(serializers.ModelSerializer):
    elements = PABlockElementSerializer(read_only=True, many=True)

    class Meta:
        model = pa_models.PageBlock
        fields = ("id", "name", "order", "elements")


class PASectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = pa_models.Section
        fields = ("id", "name", "slug")


class PATemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = pa_models.PageTemplate
        fields = ("id", "name")


class PAPageSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated = serializers.DateTimeField(read_only=True, source="modified", format="%Y-%m-%d")
    tags = serializers.SerializerMethodField()
    section = PASectionSerializer(read_only=True)
    template = PATemplateSerializer(read_only=True)

    class Meta:
        model = pa_models.Page
        fields = (
            "id",
            "name",
            "template",
            "slug",
            "description",
            "keywords",
            "section",
            "created_by",
            "updated",
            "tags",
        )

    def get_created_by(self, obj):
        return obj.created_by.get_full_name()

    def get_tags(self, obj):
        return [tag.value for tag in obj.tags.all()]


class PAPageDetailSerializer(PAPageSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta(PAPageSerializer.Meta):
        fields = PAPageSerializer.Meta.fields + ("blocks",)

    def get_blocks(self, obj):
        blocks = obj.pageblock_set.all().prefetch_related(
            Prefetch(
                "elements",
                queryset=pa_models.PageBlockElement.objects.all()
                .order_by("-order")
                .exclude(custom_element_set__isnull=False),
            ),
        )
        return PAPageBlockSerializer(blocks, many=True).data


class PASectionSerializer(serializers.ModelSerializer):
    pages = PAPageSerializer(read_only=True, many=True)

    class Meta:
        model = pa_models.Section
        fields = ("id", "name", "slug", "pages")


class PAProjectSerializer(serializers.ModelSerializer):
    meta = serializers.SerializerMethodField()
    data_sources = PADataSourceListSerializer(read_only=True, many=True)
    content = serializers.SerializerMethodField()

    class Meta:
        model = pr_models.Project
        fields = ("meta", "data_sources", "content")

    def get_meta(self, obj):
        return {
            "id": obj.id,
            "title": obj.title,
            "description": obj.description,
            "owner": obj.owner.get_full_name(),
            "created": obj.created.strftime("%Y-%m-%d"),
            "updated": obj.modified.strftime("%Y-%m-%d"),
        }

    def get_content(self, obj):
        return {"sections": PASectionSerializer(obj.sections, many=True).data}
