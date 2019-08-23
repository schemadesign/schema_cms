from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True,
        pk_field=serializers.UUIDField(format='hex_verbose')
    )

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "status",
            "owner",
            "created",
            "modified",
        )

    def create(self, validated_data):
        project = Project(
            owner=self.context['request'].user,
            **validated_data
        )
        project.save()

        return project
