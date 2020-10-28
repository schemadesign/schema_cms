from django.conf import settings
from rest_framework import serializers

from . import models
from ..utils.serializers import NestedRelatedModelSerializer, UserSerializer
from ..utils.validators import CustomUniqueValidator


class ProjectSerializer(serializers.ModelSerializer):
    owner = NestedRelatedModelSerializer(
        serializer=UserSerializer(), read_only=True, pk_field=serializers.UUIDField(format="hex_verbose")
    )
    editors = NestedRelatedModelSerializer(
        read_only=True,
        many=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
        serializer=UserSerializer(),
    )
    meta = serializers.SerializerMethodField()
    api_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Project
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "domain",
            "status",
            "owner",
            "editors",
            "created",
            "modified",
            "meta",
            "api_url",
        )
        extra_kwargs = {
            "title": {
                "validators": [CustomUniqueValidator(queryset=models.Project.objects.all(), prefix="project")]
            }
        }

    def create(self, validated_data):
        project = models.Project(owner=self.context["request"].user, **validated_data)
        project.save()

        return project

    def save(self, **kwargs):
        project = super().save(**kwargs)
        project.create_xml_file()

        return project

    @staticmethod
    def get_meta(project):
        return {
            "data_sources": project.data_source_count,
            "states": project.states_count,
            "pages": project.pages_count,
            "users": project.users_count,
            "charts": project.charts_count,
        }

    @staticmethod
    def get_api_url(project: models.Project):
        return f"{settings.PUBLIC_API_URL}projects/{project.id}"
