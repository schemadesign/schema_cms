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

    class Meta:
        model = models.Project
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
            "meta",
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

    def get_meta(self, project):
        return {
            "data_sources": project.data_source_count,
            "states": project.states_count,
            "pages": project.pages_count,
            "users": project.users_count,
            "charts": project.charts_count,
        }
