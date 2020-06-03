import json

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
    ElementType.VIDEO: lambda: utils.video_in_html,
}


class ReadOnlySerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].read_only = True


class PAFilterSerializer(ReadOnlySerializer):
    type = serializers.CharField(source="filter_type")

    class Meta:
        model = ds_models.Filter
        fields = ("id", "name", "type", "field")


class PADataSourceListSerializer(ReadOnlySerializer):
    tags = serializers.SerializerMethodField()
    meta = serializers.SerializerMethodField()

    class Meta:
        model = ds_models.DataSource
        fields = ("id", "type", "name", "meta", "tags")

    def get_tags(self, obj):
        res = {}

        for category, tag in obj.tags.values_list("category__name", "value"):
            if category not in res:
                res[category] = [tag]
            else:
                res[category].append(tag)

        return res

    def get_meta(self, obj):
        custom_data = (
            {d["key"]: d["value"] for d in obj.description.data} if hasattr(obj, "description") else {}
        )

        return {
            "id": obj.id,
            "name": obj.name,
            "created_by": obj.created_by.get_full_name(),
            "created": obj.created.strftime("%Y-%m-%d"),
            "updated": obj.modified.strftime("%Y-%m-%d"),
            "custom_data": custom_data,
        }


class PADataSourceDetailNoRecordsSerializer(PADataSourceListSerializer):
    shape = serializers.SerializerMethodField()
    fields = serializers.SerializerMethodField(method_name="get_ds_fields")
    filters = PAFilterSerializer(many=True)

    class Meta:
        model = ds_models.DataSource
        fields = ("meta", "shape", "fields", "filters", "tags")

    def get_shape(self, obj):
        return obj.active_job.meta_data.shape

    def get_ds_fields(self, obj):
        fields = json.loads(obj.active_job.meta_data.preview.read())["fields"]
        data = {
            str(num): {"name": key, "type": value["dtype"]} for num, (key, value) in enumerate(fields.items())
        }
        return data


class PADataSourceDetailRecordsSerializer(PADataSourceDetailNoRecordsSerializer):
    records = serializers.SerializerMethodField()

    class Meta(PADataSourceDetailNoRecordsSerializer.Meta):
        fields = PADataSourceDetailNoRecordsSerializer.Meta.fields + ("records",)

    def get_records(self, obj):
        return records_reader.read_records_preview(obj)


class PABlockElementSerializer(ReadOnlySerializer):
    value = serializers.SerializerMethodField()
    html = serializers.SerializerMethodField()

    class Meta:
        model = pa_models.PageBlockElement
        fields = ("id", "name", "type", "order", "value", "html")

    def get_value(self, obj):
        if obj.type == ElementType.IMAGE:
            if not obj.image:
                return {}

            return {"file_name": obj.get_original_file_name()[1], "image": obj.image.url}

        if obj.type == ElementType.OBSERVABLE_HQ:
            if not obj.observable_hq:
                return {}
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

        for element_set in custom_element.elements_sets.all():
            data = {
                "id": element_set.id,
                "order": element_set.order,
                "elements": PABlockElementSerializer(element_set.elements, many=True).data,
            }
            elements.append(data)

        return elements


class PABlockTemplateSerializer(ReadOnlySerializer):
    class Meta:
        model = pa_models.BlockTemplate
        fields = ("id", "name")


class PAPageBlockSerializer(ReadOnlySerializer):
    elements = PABlockElementSerializer(many=True)
    template = PABlockTemplateSerializer(source="block")

    class Meta:
        model = pa_models.PageBlock
        fields = ("id", "name", "template", "order", "elements")


class PASectionSerializer(ReadOnlySerializer):
    class Meta:
        model = pa_models.Section
        fields = ("id", "name", "slug")


class PATemplateSerializer(ReadOnlySerializer):
    class Meta:
        model = pa_models.PageTemplate
        fields = ("id", "name")


class PAPageSerializer(ReadOnlySerializer):
    created_by = serializers.SerializerMethodField()
    updated = serializers.DateTimeField(source="modified", format="%Y-%m-%d")
    tags = serializers.SerializerMethodField()
    section = PASectionSerializer()
    template = PATemplateSerializer()

    class Meta:
        model = pa_models.Page
        fields = (
            "id",
            "name",
            "template",
            "display_name",
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
        res = {}

        for category, tag in obj.tags.values_list("category__name", "value"):
            if category not in res:
                res[category] = [tag]
            else:
                res[category].append(tag)

        return res


class PAPageDetailSerializer(PAPageSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta(PAPageSerializer.Meta):
        fields = PAPageSerializer.Meta.fields + ("blocks",)

    def get_blocks(self, obj):
        blocks = obj.pageblock_set.all()

        return PAPageBlockSerializer(blocks, many=True).data


class PASectionSerializer(ReadOnlySerializer):
    pages = PAPageSerializer(many=True)

    class Meta:
        model = pa_models.Section
        fields = ("id", "name", "slug", "pages")


class PAProjectSerializer(ReadOnlySerializer):
    meta = serializers.SerializerMethodField()
    data_sources = PADataSourceListSerializer(many=True)
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
