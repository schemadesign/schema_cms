from django.db import transaction
from rest_framework import serializers

from . import models
from ..utils.serializers import CustomModelSerializer
from ..utils.validators import CustomUniqueTogetherValidator


class ElementValueField(serializers.Field):
    def get_value(self, dictionary):
        return super().get_value(dictionary)

    def get_attribute(self, instance):
        return getattr(instance, instance.type)

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value


class BaseElementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        fields = ("id", "name", "type", "order", "params")


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
        fields = ("id", "project", "name", "created_by", "elements", "created", "is_available", "allow_add")
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

    @staticmethod
    def create_or_update_elements(instance, elements):
        for element in elements:
            models.BlockElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(template=instance, **element)
            )

    @staticmethod
    def create_elements(elements, template):
        for element in elements:
            element_instance = models.BlockElement()
            element_instance.name = element["name"]
            element_instance.template = template
            element_instance.type = element["type"]
            element_instance.order = element["order"]
            element_instance.params = element["params"]
            yield element_instance


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
            "allow_add",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.PageTemplate.objects.all(),
                fields=("project", "name"),
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


class PageSerializer(CustomModelSerializer):
    blocks = serializers.SerializerMethodField()

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
        project = validated_data.get("section").project
        blocks = self.initial_data.get("blocks", [])
        page = self.Meta.model(project=project, **validated_data)
        page.save()

        if blocks:
            self.create_or_update_blocks(page, blocks)

        return page

    def create_or_update_blocks(self, page, blocks):
        blocks_data = self.validate_block_data(blocks)
        for block in blocks_data:
            elements = block.pop("elements", [])
            block, _ = page.create_or_update_block(block)
            self.create_block_elements(elements, block)

    def create_block_elements(self, elements, instance):
        if elements:
            models.PageBlockElement.objects.bulk_create(self.create_elements(elements, instance))

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
        blocks = obj.pageblock_set.all()
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
        )

    def get_template_name(self, page):
        if page.template:
            return page.template.name
        return None


class SectionDetailSerializer(CustomModelSerializer):
    pages = SectionPageListView(read_only=True, many=True)

    class Meta:
        model = models.Section
        fields = ("id", "project", "name", "slug", "created_by", "created", "is_public", "pages")
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Section.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="sectionNameUnique",
                message="Section with this name already exist in project.",
            )
        ]
