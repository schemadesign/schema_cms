import json

from django.conf import settings
from django.db.models import Prefetch
from rest_framework import serializers

from ..projects import models as pr_models
from ..datasources import models as ds_models
from ..pages import models as pa_models
from ..pages.constants import ElementType, PageState
from ..tags import models as t_models
from ..utils.serializers import ReadOnlySerializer
from . import utils, records_reader


element_to_html_function = {
    ElementType.CODE: lambda: utils.code_in_html,
    ElementType.CONNECTION: lambda: utils.connection_in_html,
    ElementType.CUSTOM_ELEMENT: lambda: utils.custom_in_html,
    ElementType.EMBED_VIDEO: lambda: utils.embed_video_in_html,
    ElementType.FILE: lambda: utils.file_in_html,
    ElementType.IMAGE: lambda: utils.image_in_html,
    ElementType.INTERNAL_CONNECTION: lambda: utils.internal_connection_in_html,
    ElementType.MARKDOWN: lambda: utils.markdown_in_html,
    ElementType.OBSERVABLE_HQ: lambda: utils.observable_in_html,
    ElementType.PLAIN_TEXT: lambda: utils.plain_text_in_html,
    ElementType.STATE: lambda: utils.state_in_html,
}


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

        for category, tag in obj.tags.values_list("category__name", "value").order_by("id"):
            if category not in res:
                res[category] = [tag]
            else:
                res[category].append(tag)

        return res

    def get_meta(self, obj):
        return obj.formatted_meta


class PADataSourceDetailNoRecordsSerializer(PADataSourceListSerializer):
    shape = serializers.SerializerMethodField()
    fields = serializers.SerializerMethodField(method_name="get_ds_fields")
    filters = PAFilterSerializer(many=True)

    class Meta:
        model = ds_models.DataSource
        fields = ("meta", "shape", "fields", "filters", "tags")

    def get_shape(self, obj):
        return obj.get_active_job().meta_data.shape

    def get_ds_fields(self, obj):
        fields = json.loads(obj.get_active_job().meta_data.preview.read())["fields"]
        labels = obj.meta_data.fields_labels

        data = {
            str(num): {
                "name": key,
                "type": value["dtype"],
                "label": labels.get(key, {"type": value["dtype"]}),
            }
            for num, (key, value) in enumerate(fields.items())
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
        if obj.type == ElementType.STATE:
            if not obj.state:
                return None

            return {
                "meta": obj.state.formatted_meta,
                "tags": obj.state.get_tags(),
                "url": f"{settings.PUBLIC_API_URL}{utils.generate_state_element_url(obj.state)}",
            }

        if obj.type == ElementType.IMAGE:
            if not obj.image:
                return {}

            return {
                "file_name": obj.get_original_file_name()[1],
                "image": obj.image.url,
                "alt": obj.params.get("alt"),
            }

        if obj.type == ElementType.FILE:
            if not obj.file:
                return {}

            return {
                "file_name": obj.get_original_file_name(image=False)[1],
                "file": obj.file.url,
            }

        if obj.type == ElementType.OBSERVABLE_HQ:
            if not obj.observable_hq:
                return {}
            return obj.observable_hq.as_dict()

        if obj.type == ElementType.CUSTOM_ELEMENT:
            return self.custom_element_data(obj)

        if obj.type == ElementType.INTERNAL_CONNECTION:
            page = getattr(obj, obj.type)

            if not page:
                return None

            url = f"/{page.display_name}"

            if main_page := page.section.get_main_page():
                url = f"/{main_page.display_name}" + url
            if page.project.domain:
                url = f"{page.project.domain}" + url

            return {"url": url, "page_id": page.id}

        return getattr(obj, obj.type)

    def get_html(self, obj):
        if obj.type == ElementType.CUSTOM_ELEMENT:
            return element_to_html_function[obj.type]()(obj.id, self.custom_element_data(obj))
        return element_to_html_function[obj.type]()(obj)

    @staticmethod
    def custom_element_data(custom_element):
        elements = []

        elements_sets_ids = custom_element.sets_elements.values_list(
            "custom_element_set", flat=True
        ).distinct()
        element_sets = (
            pa_models.CustomElementSet.objects.filter(id__in=elements_sets_ids)
            .prefetch_related(
                Prefetch("elements", queryset=pa_models.PageBlockElement.objects.order_by("order"))
            )
            .order_by("order")
        )

        for element_set in element_sets:
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
        model = pa_models.Page
        fields = ("id", "name")


class PAPageSerializer(ReadOnlySerializer):
    id = serializers.SerializerMethodField()
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
        return obj.created_by.get_full_name() if obj.created_by else ""

    def get_tags(self, obj):
        res = {}

        for category, tag in obj.tags.values_list("category__name", "value"):
            if category not in res:
                res[category] = [tag]
            else:
                res[category].append(tag)

        return res

    def get_id(self, obj):
        return obj.id if obj.is_draft else obj.draft_version.id


class PAPageDetailSerializer(PAPageSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta(PAPageSerializer.Meta):
        fields = PAPageSerializer.Meta.fields + ("blocks",)

    def get_blocks(self, obj):
        blocks = (
            obj.page_blocks.all()
            .prefetch_related(
                Prefetch(
                    "elements",
                    queryset=pa_models.PageBlockElement.objects.all()
                    .order_by("order")
                    .exclude(custom_element_set__isnull=False),
                )
            )
            .order_by("order")
        )

        return PAPageBlockSerializer(blocks, many=True).data


class PAPageDraftSerializer(ReadOnlySerializer):
    class Meta:
        model = pa_models.Page
        fields = ("id", "slug", "display_name")


class PASectionDetailSerializer(ReadOnlySerializer):
    meta = serializers.SerializerMethodField()
    drafts = serializers.SerializerMethodField()
    pages = serializers.SerializerMethodField()

    class Meta:
        model = pa_models.Section
        fields = ("meta", "pages", "drafts")

    def get_meta(self, obj: pa_models.Section):
        return {
            "id": obj.id,
            "name": obj.name,
            "slug": obj.slug,
            "created_by": obj.created_by.get_full_name() if obj.created_by else "",
            "project": obj.project.id,
        }

    def get_drafts(self, obj: pa_models.Section):
        return PAPageDraftSerializer(obj.pages.filter(is_draft=True), many=True).data

    def get_pages(self, obj: pa_models.Section):
        return PAPageSerializer(
            obj.pages.filter(is_draft=False, state__in=[PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH]),
            many=True,
        ).data


class PASectionWithPagesSerializer(ReadOnlySerializer):
    pages = serializers.SerializerMethodField()
    drafts = serializers.SerializerMethodField()

    class Meta:
        model = pa_models.Section
        fields = ("id", "name", "slug", "pages", "drafts")

    def get_drafts(self, section):
        return PAPageDraftSerializer(section.pages.filter(is_draft=True), many=True).data

    def get_pages(self, section):
        return PAPageSerializer(
            section.pages.filter(
                is_draft=False, state__in=[PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH]
            ),
            many=True,
        ).data


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
            "owner": obj.owner.get_full_name() if obj.owner else "",
            "created": obj.created.strftime("%Y-%m-%d"),
            "updated": obj.modified.strftime("%Y-%m-%d"),
            "xml_file": obj.xml_file.url.rsplit("?", 1)[0] if obj.xml_file else None,
        }

    def get_content(self, obj):
        return {"sections": PASectionWithPagesSerializer(obj.sections, many=True).data}


class PATagCategorySerializer(ReadOnlySerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = t_models.TagCategory
        fields = ("id", "name", "is_single_select", "type", "tags")

    def get_tags(self, obj):
        return [t.value for t in obj.tags.all().order_by("value")]
