from django.db import transaction
from rest_framework import serializers

from . import models
from ..utils.validators import CustomUniqueTogetherValidator


class TagSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = models.Tag
        fields = ("id", "value", "order")


class TagCategorySerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    delete_tags = serializers.ListField(required=False, write_only=True)

    class Meta:
        model = models.TagCategory
        fields = ("id", "name", "project", "is_single_select", "is_public", "tags", "delete_tags")
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.TagCategory.objects.all(),
                fields=("name", "project"),
                key_field_name="name",
                code="tagCategoryNameNotUnique",
                message="Tag Category with this name already exist in project.",
            )
        ]

    @transaction.atomic()
    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        category = super().create(validated_data)

        category.update_or_create_tags(tags)

        return category

    @transaction.atomic()
    def update(self, instance, validated_data):
        delete_tags = validated_data.pop("delete_tags", [])
        tags = validated_data.pop("tags", [])

        category = super().update(instance, validated_data)
        category.delete_tags(delete_tags)
        category.update_or_create_tags(tags)

        return category
