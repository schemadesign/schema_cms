import base64
import mimetypes

from django.db import transaction, models as django_models
from django.db.models.fields.files import ImageFieldFile
from django.core.files.base import ContentFile
from django.core.validators import URLValidator
from django.conf import settings
from rest_framework import serializers

from . import models, constants
from ..utils.serializers import CustomModelSerializer, NestedRelatedModelSerializer
from ..utils.validators import CustomUniqueTogetherValidator


class ElementValueField(serializers.Field):
    type = None
    text_type = [
        constants.ElementType.PLAIN_TEXT,
        constants.ElementType.MARKDOWN,
        constants.ElementType.CODE,
    ]

    default_error_messages = {
        "incorrect_type": "Incorrect type. Expected a string, but go {input_type}",
        "file_upload_fail": "File decoding problem",
        "invalid_file": "Invalid file. Expected a .png, .jpg , but go {input_type}",
    }

    def to_representation(self, value):
        if isinstance(value, ImageFieldFile):
            return {"file": value.url, "file_name": self.get_file_name(value.name)}
        return value

    def get_value(self, dictionary):
        self.type = dictionary.get("type")

        return super().get_value(dictionary)

    def get_attribute(self, instance):

        if instance.type == constants.ElementType.CUSTOM_ELEMENT:
            elements = instance.elements.all()
            elements = PageBlockElementSerializer(elements, many=True).data

            return {"elements": elements}

        if instance.type == constants.ElementType.OBSERVABLE_HQ:
            observable_element = getattr(instance, instance.type)
            return {
                "observable_user": observable_element.observable_user,
                "observable_notebook": observable_element.observable_notebook,
                "observable_cell": observable_element.observable_cell,
                "observable_params": observable_element.observable_params,
            }

        return getattr(instance, instance.type)

    def to_internal_value(self, data):
        if self.type == constants.ElementType.IMAGE:
            data = self.validate_image_type(data)

        if self.type in self.text_type:
            self.validate_text_types(data)

        if self.type == constants.ElementType.CONNECTION:
            self.validate_url_type(data)

        if self.type == constants.ElementType.INTERNAL_CONNECTION:
            self.validate_text_types(data)

        return data

    @staticmethod
    def validate_url_type(data):
        validator = URLValidator()
        validator(str(data))

    def validate_text_types(self, data):
        if not isinstance(data, str):
            self.fail("incorrect_type", input_type=type(data).__name__)

    def validate_image_type(self, data):
        file = data["file"]
        file_name = data["file_name"]

        if "data:" in file and ";base64," in file:
            header, file = file.split(";base64,")
        else:
            return False

        try:
            decoded_file = base64.b64decode(file)
        except TypeError:
            self.fail("file_upload_fail")

        mime_type = mimetypes.MimeTypes().guess_type(file_name)[0]
        ext = mimetypes.guess_extension(mime_type)

        if ext not in settings.IMAGE_ALLOWED_EXT:
            self.fail("invalid_file", input_type=ext)

        return ContentFile(decoded_file, name=f"{file_name}")

    @staticmethod
    def get_file_name(file):
        return file.split("/")[-1]


class BaseElementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        fields = ("id", "name", "type", "order", "params")


class CustomElementContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BlockElement
        fields = ("type", "order")


class BlockElementSerializer(BaseElementSerializer):
    class Meta:
        model = models.BlockElement
        fields = BaseElementSerializer.Meta.fields + ("template",)
        extra_kwargs = {"template": {"required": False}}


class PageBlockElementSerializer(BaseElementSerializer):
    value = ElementValueField(read_only=False)

    class Meta:
        model = models.PageBlockElement
        fields = BaseElementSerializer.Meta.fields + ("value",)


class BlockTemplateSerializer(CustomModelSerializer):
    elements = BlockElementSerializer(many=True)

    class Meta:
        model = models.Block
        fields = ("id", "project", "name", "created_by", "elements", "created", "is_available")
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Block.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="blockTemplateNameUnique",
                message="Block template with this name already exist in project.",
            )
        ]

    @transaction.atomic()
    def create(self, validated_data):
        elements = validated_data.pop("elements", [])

        template = self.Meta.model(created_by=self.context["request"].user, **validated_data)
        template.save()

        models.BlockElement.objects.bulk_create(self.create_elements(elements, template))

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
            models.BlockElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(template=instance, **element)
            )

    def create_elements(self, elements, template):
        for element in elements:

            if element["type"] == constants.ElementType.CUSTOM_ELEMENT:
                self.validate_custom_element(element)

            element_instance = models.BlockElement()
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
        elements = template.block.elements.all()
        return BlockElementSerializer(elements, many=True).data


class PageTemplateSerializer(CustomModelSerializer):
    blocks = serializers.SerializerMethodField()
    is_template = serializers.HiddenField(default=True, write_only=True)

    class Meta:
        model = models.PageTemplate
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
                queryset=models.PageTemplate.objects.all(),
                fields=("project", "name", "is_template"),
                key_field_name="name",
                code="pageTemplateNameUnique",
                message="Page Template with this name already exist in project.",
            )
        ]

    @transaction.atomic()
    def create(self, validated_data):
        blocks = self.initial_data.pop("blocks", [])
        template = self.Meta.model(created_by=self.context["request"].user, **validated_data)
        template.save()

        if blocks:
            self.create_or_update_blocks(template, blocks)

        return template

    @transaction.atomic()
    def update(self, instance, validated_data):
        blocks = self.initial_data.pop("blocks", [])
        blocks_to_delete = self.initial_data.pop("delete_blocks", [])

        if blocks_to_delete:
            instance.delete_blocks(blocks_to_delete)

        instance = super().update(instance, validated_data)

        if blocks:
            self.create_or_update_blocks(instance, blocks)

        return instance

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
        blocks = template.pageblock_set.all()
        return PageTemplateBlockSerializer(blocks, many=True).data


class PageBlockSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    type = serializers.SerializerMethodField()
    elements = PageBlockElementSerializer(many=True)

    class Meta:
        model = models.PageBlock
        fields = ("id", "block", "name", "type", "order", "elements")

    def get_type(self, obj):
        return obj.block.name


class MainPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = ("id", "name", "display_name")


class PageSectionSerializer(serializers.ModelSerializer):
    main_page = NestedRelatedModelSerializer(
        serializer=MainPageSerializer(), queryset=models.Page.objects.all()
    )

    class Meta:
        model = models.Section
        fields = ("id", "name", "main_page")


class PageSerializer(CustomModelSerializer):
    blocks = serializers.SerializerMethodField()
    section = NestedRelatedModelSerializer(
        serializer=PageSectionSerializer(), queryset=models.Section.objects.all()
    )

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
            "created_by",
            "created",
            "blocks",
            "is_public",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Page.objects.all(),
                fields=("section", "name"),
                key_field_name="name",
                code="pageNameUnique",
                message="Page with this name already exist in section.",
            )
        ]

    @transaction.atomic()
    def create(self, validated_data):
        validated_data["project"] = validated_data.get("section").project
        blocks = self.initial_data.get("blocks", [])

        page = super().create(validated_data)

        if not validated_data.get("display_name"):
            page.display_name = page.slug
            page.save()

        if blocks:
            self.create_or_update_blocks(page, blocks)

        return page

    @transaction.atomic()
    def update(self, instance, validated_data):
        blocks = self.initial_data.pop("blocks", [])
        blocks_to_delete = self.initial_data.pop("delete_blocks", [])

        if blocks_to_delete:
            instance.delete_blocks(blocks_to_delete)

        instance = super().update(instance, validated_data)

        if not instance.display_name:
            instance.display_name = instance.slug
            instance.save()

        if blocks:
            self.create_or_update_blocks(instance, blocks)

        return instance

    def create_or_update_blocks(self, page, blocks):
        blocks_data = self.validate_block_data(blocks)
        for block in blocks_data:
            elements = block.pop("elements", [])
            block, _ = page.create_or_update_block(block)

            self.create_or_update_elements(block, elements)

    @staticmethod
    def create_or_update_elements(instance, elements):
        for element in elements:
            element_type = element.get("type")

            if "value" in element:
                element_value = element.pop("value")

                if element_type == constants.ElementType.IMAGE and element_value:
                    element[element_type] = element_value

                if element_type in [
                    constants.ElementType.MARKDOWN,
                    constants.ElementType.PLAIN_TEXT,
                    constants.ElementType.CODE,
                ]:
                    element[element_type] = element_value

            obj, _ = models.PageBlockElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(block=instance, **element)
            )

            if element_type == constants.ElementType.CUSTOM_ELEMENT:
                obj.update_or_create_custom_elements(element_value["elements"])

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
    def get_blocks(obj):
        blocks = obj.pageblock_set.all().prefetch_related(
            django_models.Prefetch(
                "elements",
                queryset=models.PageBlockElement.objects.all()
                .order_by("order")
                .exclude(custom_element__isnull=False),
            )
        )
        return PageBlockSerializer(blocks, many=True).data


class SectionListCreateSerializer(CustomModelSerializer):
    pages_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Section
        fields = ("id", "project", "name", "slug", "created_by", "created", "is_public", "pages_count")
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


class PageDisplayNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = ("id", "display_name", "name")


class SectionInternalConnectionSerializer(serializers.ModelSerializer):
    main_page = MainPageSerializer(read_only=True)
    pages = PageDisplayNameSerializer(read_only=True, many=True)

    class Meta:
        model = models.Section
        fields = ("id", "project", "name", "main_page", "pages")


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
    pages = SectionPageListView(read_only=True, many=True)

    class Meta:
        model = models.Section
        fields = ("id", "project", "name", "slug", "created_by", "created", "is_public", "pages", "main_page")
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
