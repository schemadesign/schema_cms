from django.db import transaction
from rest_framework import serializers

from ..users.models import User
from ..utils.serializers import NestedRelatedModelSerializer
from .models import DataSource, DataSourceMeta, Project


class DataSourceMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSourceMeta
        fields = ("items", "fields", "preview")


class DataSourceSerializer(serializers.ModelSerializer):
    meta_data = DataSourceMetaSerializer(read_only=True)
    file_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DataSource
        fields = ("id", "name", "type", "status", "file", "file_name", "meta_data")
        extra_kwargs = {
            "name": {"required": True, "allow_null": False, "allow_blank": False},
            "type": {"required": True, "allow_null": False},
            "file": {"required": True, "allow_null": False},
        }

    def get_file_name(self, obj):
        if obj.file:
            _, file_name = obj.get_original_file_name()
            return file_name


class DraftDataSourceSerializer(serializers.ModelSerializer):
    meta_data = DataSourceMetaSerializer(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = DataSource
        fields = ("id", "name", "type", "status", "file", "meta_data")
        extra_kwargs = {
            "name": {"required": False, "allow_null": True},
            "type": {"required": False, "allow_null": True},
            "file": {"required": False, "allow_null": True},
        }


class ProjectOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class ProjectSerializer(serializers.ModelSerializer):
    owner = NestedRelatedModelSerializer(
        serializer=ProjectOwnerSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )

    editors = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        pk_field=serializers.UUIDField(format="hex_verbose"),
        allow_empty=True,
    )

    class Meta:
        model = Project
        fields = ("id", "title", "slug", "description", "status", "owner", "editors", "created", "modified")

    def create(self, validated_data):
        editors = validated_data.pop("editors")
        project = Project(owner=self.context["request"].user, **validated_data)

        with transaction.atomic():
            project.save()
            project.editors.add(*editors)

        return project
