import base64
from django.core.files.base import ContentFile
from django.db import transaction, models as django_models
from rest_framework import serializers

from .elements import ELEMENTS_TYPES
from . import models, constants
from ..utils.serializers import CustomModelSerializer, ReadOnlySerializer
from ..utils.validators import CustomUniqueTogetherValidator
from ..projects.constants import ProjectStatus


class CustomImageField(serializers.Field):
    def to_representation(self, value):
        if not value:
            return {}

        return {"file": value.url, "file_name": self.get_file_name(value.name)}

    def to_internal_value(self, data):
        if not data:
            return None

        file = data["file"]
        file_name = data["file_name"]

        if "data:" in file and ";base64," in file:
            header, file = file.split(";base64,")
        else:
            return False

        decoded_file = base64.b64decode(file)

        return ContentFile(decoded_file, name=f"{file_name}")

    @staticmethod
    def get_file_name(file):
        return file.split("/")[-1]


class ElementValueField(serializers.Field):
    element = None

    def to_representation(self, value):
        return self.element.to_representation(value)

    def get_value(self, dictionary):
        element_type = dictionary.get("type")

        if element_type:
            self.element = ELEMENTS_TYPES.get(element_type)(element_type)

        return super().get_value(dictionary)

    def get_attribute(self, instance):
        self.element = ELEMENTS_TYPES.get(instance.type)(instance.type)

        return self.element.get_attribute(instance)

    def to_internal_value(self, data):
        return self.element.to_internal_value(data)


class BaseElementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        fields = ("id", "name", "type", "order", "params")


class CustomElementContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BlockTemplateElement
        fields = ("type", "order")


class BlockElementSerializer(BaseElementSerializer):
    class Meta:
        model = models.BlockTemplateElement
        fields = BaseElementSerializer.Meta.fields + ("template",)
        extra_kwargs = {"template": {"required": False}}


class PageBlockElementSerializer(BaseElementSerializer):
    value = ElementValueField(read_only=False, allow_null=True)
    delete_elements_sets = serializers.ListField(required=False, write_only=True)

    class Meta:
        model = models.PageBlockElement
        fields = BaseElementSerializer.Meta.fields + ("value", "delete_elements_sets")


class BlockTemplateSerializer(CustomModelSerializer):
    elements = BlockElementSerializer(many=True)

    class Meta:
        model = models.BlockTemplate
        fields = ("id", "project", "name", "created_by", "elements", "created", "is_available")
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.BlockTemplate.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="blockTemplateNameUnique",
                message="Block template with this name already exist in project.",
            )
        ]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["elements"] = sorted(response["elements"], key=lambda x: x["order"])
        return response

    @transaction.atomic()
    def create(self, validated_data):
        elements = validated_data.pop("elements", [])

        template = self.Meta.model(created_by=self.context["request"].user, **validated_data)
        template.save()

        models.BlockTemplateElement.objects.bulk_create(self.create_elements(elements, template))

        return template

    @transaction.atomic()
    def update(self, instance, validated_data):
        elements = validated_data.pop("elements", [])
        elements_to_delete = self.initial_data.pop("delete_elements", [])

        if elements_to_delete:
            instance.delete_elements(elements_to_delete)

        instance = super().update(instance, validated_data)

        self.create_or_update_elements(instance, elements)

        return instance

    def create_or_update_elements(self, instance, elements):
        for element in elements:
            if element["type"] == constants.ElementType.CUSTOM_ELEMENT:
                self.validate_custom_element(element)
            models.BlockTemplateElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(template=instance, **element)
            )

    def create_elements(self, elements, template):
        for element in elements:

            if element["type"] == constants.ElementType.CUSTOM_ELEMENT:
                self.validate_custom_element(element)

            element_instance = models.BlockTemplateElement()
            element_instance.name = element["name"]
            element_instance.template = template
            element_instance.type = element["type"]
            element_instance.order = element["order"]
            element_instance.params = element["params"]

            yield element_instance

    @staticmethod
    def validate_custom_element(element):
        if element.get("params"):
            custom_elements = element.get("params").get("elements", None)

        if not custom_elements:
            message = "Custom Element have to contain at least one of standard elements"
            raise serializers.ValidationError(message)

        serializer = CustomElementContentSerializer(data=custom_elements, many=True)
        serializer.is_valid(raise_exception=True)


class PageTemplateBlockSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    type = serializers.SerializerMethodField()
    elements = serializers.SerializerMethodField()

    class Meta:
        model = models.PageBlock
        fields = ("id", "block", "name", "type", "order", "elements")

    def get_type(self, template):
        return template.block.name

    def get_elements(self, template):
        elements = template.block.elements.all().order_by("order")
        return BlockElementSerializer(elements, many=True).data


class PageTemplateSerializer(CustomModelSerializer):
    blocks = serializers.SerializerMethodField()
    is_template = serializers.HiddenField(default=True, write_only=True)

    class Meta:
        model = models.Page
        fields = (
            "id",
            "project",
            "name",
            "slug",
            "created_by",
            "created",
            "blocks",
            "is_available",
            "allow_edit",
            "is_template",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Page.templates.all(),
                fields=("project", "name", "is_template"),
                key_field_name="name",
                code="pageTemplateNameUnique",
                message="Page Template with this name already exist in project.",
            )
        ]

    @transaction.atomic()
    def save(self, *args, **kwargs):
        blocks = self.initial_data.pop("blocks", [])
        blocks_to_delete = self.initial_data.pop("delete_blocks", [])

        template = super().save(created_by=self.context["request"].user, **kwargs)

        if blocks_to_delete:
            template.delete_blocks(blocks_to_delete)

        if blocks:
            self.create_or_update_blocks(template, blocks)

        return template

    def create_or_update_blocks(self, template, blocks):
        blocks_data = self.validate_block_data(blocks)
        for block in blocks_data:
            template.create_or_update_block(block)

    @staticmethod
    def validate_block_data(blocks: dict):
        serializer = PageTemplateBlockSerializer(data=blocks, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    @staticmethod
    def get_blocks(template):
        blocks = template.page_blocks.all().order_by("order")
        return PageTemplateBlockSerializer(blocks, many=True).data


class PageBlockSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    type = serializers.SerializerMethodField()
    elements = PageBlockElementSerializer(many=True)

    class Meta:
        model = models.PageBlock
        fields = ("id", "block", "name", "type", "order", "elements")

    def get_type(self, obj):
        return obj.block.name if obj.block else None


class MainPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = ("id", "name", "display_name")


class PageSectionSerializer(serializers.ModelSerializer):
    main_page = serializers.SerializerMethodField()

    class Meta:
        model = models.Section
        fields = ("id", "name", "main_page")

    def get_main_page(self, obj: models.Section):
        main_page = obj.get_main_page()

        if main_page:
            return MainPageSerializer(main_page, read_only=True).data
        return None


class PageTagSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", default="", read_only=True)

    class Meta:
        model = models.PageTag
        fields = ("category", "category_name", "value")


class PageBaseSerializer(CustomModelSerializer):
    template = serializers.PrimaryKeyRelatedField(
        queryset=models.Page.templates.all(), allow_null=True, required=False
    )
    tags = PageTagSerializer(read_only=True, many=True)
    is_changed = serializers.SerializerMethodField()
    social_image = CustomImageField(required=False, allow_null=True)

    class Meta:
        model = models.Page
        fields = (
            "id",
            "section",
            "template",
            "name",
            "display_name",
            "description",
            "keywords",
            "tags",
            "created_by",
            "created",
            "is_public",
            "is_changed",
            "link",
            "social_title",
            "social_description",
            "social_image_title",
            "social_image",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Page.only_pages.all(),
                fields=("section", "name"),
                key_field_name="name",
                code="pageNameUnique",
                message="Page with this name already exist in section.",
            )
        ]

    def to_representation(self, obj):
        self.fields["section"] = PageSectionSerializer()
        return super().to_representation(obj)

    def save(self, *args, **kwargs):
        blocks = self.initial_data.get("blocks", [])
        blocks_to_delete = self.initial_data.pop("delete_blocks", [])

        with transaction.atomic():
            page = super().save(**kwargs)

            if not page.display_name:
                page.display_name = page.slug
                page.save()

            if blocks_to_delete:
                page.delete_blocks(blocks_to_delete)

            if blocks:
                self.create_or_update_blocks(page, blocks)

            if (tags := self.initial_data.get("tags")) is not None:
                page.add_tags(tags)

            if page.project.status == ProjectStatus.PUBLISHED:
                page.project.in_progress()
                page.project.save()

        return page

    def create_or_update_blocks(self, page, blocks):
        blocks_data = self.validate_block_data(blocks)
        for block in blocks_data:
            elements = block.pop("elements", [])
            block, _ = page.create_or_update_block(block)

            self.create_or_update_elements(block, elements)

    def create_or_update_elements(self, instance, elements):
        for element in elements:
            element_type = element.get("type")

            if "value" in element:
                element_value = element.pop("value")

                if (
                    element_type in [constants.ElementType.IMAGE, constants.ElementType.FILE]
                    and element_value is not False
                ):
                    element[element_type] = element_value

                if element_type in [
                    constants.ElementType.MARKDOWN,
                    constants.ElementType.PLAIN_TEXT,
                    constants.ElementType.CODE,
                    constants.ElementType.INTERNAL_CONNECTION,
                    constants.ElementType.CONNECTION,
                    constants.ElementType.EMBED_VIDEO,
                    constants.ElementType.STATE,
                ]:
                    element[element_type] = element_value

            obj, _ = models.PageBlockElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(block=instance, **element)
            )

            if element_type == constants.ElementType.CUSTOM_ELEMENT:
                delete_elements_sets = element.pop("delete_elements_sets", [])

                if delete_elements_sets:
                    obj.delete_custom_elements_sets(delete_elements_sets)

                validated_element_value = self.validate_custom_element_sets(element_value)
                obj.update_or_create_custom_element_sets(validated_element_value)

            if element_type == constants.ElementType.OBSERVABLE_HQ:
                obj.create_update_observable_element(element_value)

    @staticmethod
    def create_elements(elements, block):
        for element in elements:
            element_instance = models.PageBlockElement()
            element_instance.block = block
            setattr(element_instance, element["type"], element.pop("value"))

            for key, value in element.items():
                setattr(element_instance, key, value)

            yield element_instance

    @staticmethod
    def validate_block_data(blocks: dict):
        serializer = PageBlockSerializer(data=blocks, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    @staticmethod
    def validate_custom_element_sets(elements_sets_list):
        validated_elements_sets_list = []

        for elements_set in elements_sets_list:
            serializer = PageBlockElementSerializer(data=elements_set["elements"], many=True, partial=True)
            serializer.is_valid(raise_exception=True)
            elements_set["elements"] = serializer.validated_data
            validated_elements_sets_list.append(elements_set)

        return validated_elements_sets_list

    @staticmethod
    def get_blocks(obj):
        blocks = (
            obj.page_blocks.all()
            .prefetch_related(
                django_models.Prefetch(
                    "elements",
                    queryset=models.PageBlockElement.objects.all()
                    .order_by("order")
                    .exclude(custom_element_set__isnull=False),
                )
            )
            .order_by("order")
        )

        return PageBlockSerializer(blocks, many=True).data

    @staticmethod
    def get_is_changed(obj: models.Page):
        return obj.published_version.state in [
            constants.PageState.DRAFT,
            constants.PageState.WAITING_TO_REPUBLISH,
        ]


class PageCreateSerializer(PageBaseSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta:
        model = models.Page
        fields = PageBaseSerializer.Meta.fields + ("blocks",)
        validators = PageBaseSerializer.Meta.validators

    @transaction.atomic()
    def save(self, *args, **kwargs):
        page = super().save(*args, **kwargs)

        published_version = page.copy_page(attrs={"is_draft": False})

        page.published_version = published_version
        page.save()

        return page


class PageListSerializer(PageBaseSerializer):
    template_name = serializers.CharField(source="template.name", read_only=True)

    class Meta(PageBaseSerializer.Meta):
        fields = PageBaseSerializer.Meta.fields + ("template_name",)


class PageDetailSerializer(PageBaseSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta:
        model = models.Page
        fields = PageBaseSerializer.Meta.fields + ("blocks",)

    @transaction.atomic()
    def save(self, *args, **kwargs):
        page = super().save(*args, **kwargs)

        self.update_published_version_state(page)

        return page

    @staticmethod
    def update_published_version_state(page: models.Page):
        published_version: models.Page = page.published_version

        if published_version.state == constants.PageState.PUBLISHED:
            published_version.wait_to_republish()
            published_version.save()


class SectionListCreateSerializer(CustomModelSerializer):
    pages_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Section
        fields = (
            "id",
            "project",
            "name",
            "slug",
            "created_by",
            "created",
            "is_public",
            "pages_count",
            "is_rss_content",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Section.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="sectionNameUnique",
                message="Section with this name already exist in project.",
            )
        ]

    def get_pages_count(self, section):
        return section.pages_count


class PageDisplayNameSerializer(ReadOnlySerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = models.Page
        fields = ("id", "display_name", "name", "is_public")

    def get_id(self, obj: models.Page):
        return obj.id if obj.is_draft else obj.draft_version.id


class SectionInternalConnectionSerializer(ReadOnlySerializer):
    main_page = serializers.SerializerMethodField()
    pages = PageDisplayNameSerializer(read_only=True, many=True)

    class Meta:
        model = models.Section
        fields = ("id", "name", "main_page", "pages")

    def get_main_page(self, obj: models.Section):
        main_page = obj.get_main_page()

        if main_page:
            return MainPageSerializer(main_page, read_only=True).data
        return None


class SectionPageListView(CustomModelSerializer):
    template_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Page
        fields = (
            "id",
            "template",
            "template_name",
            "name",
            "created_by",
            "created",
            "display_name",
        )

    def get_template_name(self, page):
        if page.template:
            return page.template.name

        return None


class SectionDetailSerializer(CustomModelSerializer):
    main_page = serializers.SerializerMethodField()
    pages = SectionPageListView(read_only=True, many=True)

    class Meta:
        model = models.Section
        fields = (
            "id",
            "project",
            "name",
            "slug",
            "created_by",
            "created",
            "is_public",
            "pages",
            "main_page",
            "is_rss_content",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Section.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="sectionNameUnique",
                message="Section with this name already exist in project.",
            )
        ]

    def validate_main_page(self, value):
        if not value or self.instance.pages.filter(id=value.id).exists():
            return value
        else:
            raise serializers.ValidationError("Page does not exist in section")

    @transaction.atomic()
    def update(self, instance, validated_data):
        main_page_id = self.initial_data.get("main_page")

        section = super().update(instance, validated_data)
        section.project.create_xml_file()

        if main_page_id:
            section.set_main_page(main_page_id)

        return section

    def get_main_page(self, obj: models.Section):
        main_page = obj.get_main_page()

        if main_page:
            return main_page.id
        return None
