from django.db import transaction
from rest_framework import serializers

from . import constants, models
from ..utils.serializers import NestedRelatedModelSerializer, UserSerializer
from ..utils.validators import CustomUniqueValidator
from ..pages.models import Page
from ..pages.constants import PageState


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
            "domain",
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

    @transaction.atomic()
    def update(self, instance, validated_data):
        project = super().update(instance, validated_data)

        if "status" in validated_data and validated_data["status"] == constants.ProjectStatus.PUBLISHED:
            pages_to_publish = Page.objects.filter(
                project=project, is_draft=False, state__in=[PageState.DRAFT, PageState.WAITING_TO_REPUBLISH]
            )

            for page in pages_to_publish:
                page.publish()
                page.save()

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
