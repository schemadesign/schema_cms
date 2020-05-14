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
    created_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.TagCategory
        fields = (
            "id",
            "name",
            "project",
            "type",
            "is_single_select",
            "is_public",
            "tags",
            "created",
            "created_by",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.TagCategory.objects.all(),
                fields=("name", "project"),
                key_field_name="name",
                code="tagCategoryNameNotUnique",
                message="Tag Category with this name already exist in project.",
            )
        ]

    def get_created_by(self, obj):
        if getattr(obj, "created_by"):
            return obj.created_by.get_full_name()
        return None

    @transaction.atomic()
    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        category = super().create(validated_data)

        category.update_or_create_tags(tags)

        return category

    @transaction.atomic()
    def update(self, instance, validated_data):
        delete_tags = self.initial_data.get("delete_tags", [])
        tags = validated_data.pop("tags", [])

        category = super().update(instance, validated_data)
        category.delete_tags(delete_tags)
        category.update_or_create_tags(tags)

        return category
