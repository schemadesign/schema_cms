from django.db import transaction
from rest_framework import serializers


from . import models
from ..utils.serializers import CustomModelSerializer


class BlockTemplateElementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = models.BlockTemplateElement
        fields = ("id", "template", "name", "type", "order", "params")
        extra_kwargs = {"template": {"required": False}}


class BlockTemplateSerializer(CustomModelSerializer):
    elements = BlockTemplateElementSerializer(many=True)

    class Meta:
        model = models.BlockTemplate
        fields = ("id", "project", "name", "created_by", "elements", "created", "is_available", "allow_add")

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
            instance.elements.filter(id__in=elements_to_delete).delete()

        instance = super().update(instance, validated_data)

        self.create_or_update_elements(instance, elements)

        return instance

    @staticmethod
    def create_or_update_elements(instance, elements):
        for element in elements:
            models.BlockTemplateElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(template=instance, **element)
            )

    @staticmethod
    def create_elements(elements, template):
        for element in elements:
            element_instance = models.BlockTemplateElement()
            element_instance.name = element["name"]
            element_instance.template = template
            element_instance.type = element["type"]
            element_instance.order = element["order"]
            element_instance.params = element["params"]
            yield element_instance


class PageTemplateBlockSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    block = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.PageTemplateBlock
        fields = ("block", "name", "type", "order")
        extra_kwargs = {"block_template": {"write_only": True}}

    def get_type(self, block):
        return block.block_template.name

    def get_block(self, block):
        block.block_template.id


class PageTemplateSerializer(CustomModelSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta:
        model = models.PageTemplate
        fields = ("id", "project", "name", "created_by", "created", "blocks", "is_available", "allow_add")

    @transaction.atomic()
    def create(self, validated_data):
        blocks = self.initial_data.pop("blocks", [])
        template = self.Meta.model(created_by=self.context["request"].user, **validated_data)
        template.save()

        if blocks:
            self.add_blocks(template, blocks)

        return template

    @transaction.atomic()
    def update(self, instance, validated_data):
        blocks = self.initial_data.pop("blocks", [])
        blocks_to_delete = self.initial_data.pop("delete_blocks", [])

        if blocks_to_delete:
            instance.blocks.remove(blocks_to_delete)

        instance = super().update(instance, validated_data)

        if blocks:
            instance.blocks.clear()
            self.add_blocks(instance, blocks)

        return instance

    @staticmethod
    def add_blocks(template, blocks):
        for block in blocks:
            block_id = block.pop("block")
            template.blocks.add(block_id, through_defaults={**block})

    def get_blocks(self, template):
        blocks = template.pagetemplateblock_set.all()
        return PageTemplateBlockSerializer(blocks, many=True).data
