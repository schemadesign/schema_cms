from rest_framework import serializers

from ..users.models import User
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True,
        pk_field=serializers.UUIDField(format='hex_verbose')
    )

    editors = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        pk_field=serializers.UUIDField(format='hex_verbose'),
        allow_empty=True,
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
            "editors",
            "created",
            "modified",
        )

    def create(self, validated_data):
        editors = validated_data.pop("editors")
        project = Project(
            owner=self.context['request'].user,
            **validated_data
        )
        project.save()
        project.editors.add(*editors)

        return project
