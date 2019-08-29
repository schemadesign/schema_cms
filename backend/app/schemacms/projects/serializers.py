from django.db import transaction
from rest_framework import serializers

from ..users.models import User
from ..utils.serializers import NestedRelatedModelSerializer
from .models import DataSource, DataSourceMeta, Project


class DataSourceMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSourceMeta
        fields = (
            'items',
            'fields',
        )


class DataSourceSerializer(serializers.ModelSerializer):
    meta_data = DataSourceMetaSerializer(read_only=True)

    class Meta:
        model = DataSource
        fields = (
            'id',
            'name',
            'project',
            'type',
            'file',
            'meta_data',
        )


class ProjectOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name'
        )


class ProjectSerializer(serializers.ModelSerializer):
    owner = NestedRelatedModelSerializer(
        serializer=ProjectOwnerSerializer(),
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

        with transaction.atomic():
            project.save()
            project.editors.add(*editors)

        return project
