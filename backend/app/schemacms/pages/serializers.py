from rest_framework import serializers

from . import models


class BlockTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BlockTemplate
        fields = ("project", "name", "created_by", "items")


class PageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PageTemplate
        fields = ("project", "name", "created_by", "blocks")

    def create(self, validated_data):
        template = models.PageTemplate(created_by=self.context["request"].user, **validated_data)
        template.save()

        return template
