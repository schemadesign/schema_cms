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
        fields = ("id", "project", "name", "created_by", "elements")

    @transaction.atomic()
    def create(self, validated_data):
        with transaction.atomic():
            elements = validated_data.pop("elements", [])
            template = self.Meta.model(created_by=self.context["request"].user, **validated_data)
            template.save()
            models.BlockTemplateElement.objects.bulk_create(self.create_elements(elements, template))

        return template

    @transaction.atomic()
    def update(self, instance, validated_data):
        elements = validated_data.pop("elements", [])
        instance = super().update(instance, validated_data)

        for element in elements:
            models.BlockTemplateElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(template=instance, **element)
            )
        return instance

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


class PageTemplateSerializer(CustomModelSerializer):
    class Meta:
        model = models.PageTemplate
        fields = ("id", "project", "name", "created_by", "blocks")

    def create(self, validated_data):
        blocks = validated_data.pop("blocks")
        with transaction.atomic():
            template = self.Meta.model(created_by=self.context["request"].user, **validated_data)
            template.save()
            template.add(*blocks)

        return template
