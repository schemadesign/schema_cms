import django_fsm
from django.db import transaction
from rest_framework import serializers, exceptions

from schemacms.projects import models
from .models import DataSource, DataSourceMeta, Project, WranglingScript
from schemacms.projects import services
from ..users.models import User
from ..utils.serializers import NestedRelatedModelSerializer


class DataSourceMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSourceMeta
        fields = ("items", "fields", "preview")


class DataSourceCreatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class DataSourceSerializer(serializers.ModelSerializer):
    meta_data = DataSourceMetaSerializer(read_only=True)
    file_name = serializers.SerializerMethodField(read_only=True)
    created_by = NestedRelatedModelSerializer(
        serializer=DataSourceCreatorSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )
    error_log = serializers.SerializerMethodField()

    class Meta:
        model = DataSource
        fields = (
            "id",
            "name",
            "created_by",
            "type",
            "status",
            "file",
            "file_name",
            "created",
            "meta_data",
            "error_log",
        )
        extra_kwargs = {
            "name": {"required": True, "allow_null": False, "allow_blank": False},
            "type": {"required": True, "allow_null": False},
            "file": {"required": True, "allow_null": False},
        }

    def get_file_name(self, obj):
        if obj.file:
            _, file_name = obj.get_original_file_name()
            return file_name

    def get_error_log(self, obj):
        return []

    @transaction.atomic()
    def update(self, instance, validated_data):
        obj = super().update(instance=instance, validated_data=validated_data)
        user = self.context["request"].user
        if django_fsm.has_transition_perm(obj.ready_for_processing, user):
            obj.ready_for_processing()
            obj.save()
        return obj


class DraftDataSourceSerializer(serializers.ModelSerializer):
    meta_data = DataSourceMetaSerializer(read_only=True)

    class Meta:
        model = DataSource
        fields = ("id", "name", "type", "file", "meta_data")
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
        required=False,
    )
    meta = serializers.SerializerMethodField()

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
            "meta",
        )

    def create(self, validated_data):
        editors = validated_data.pop("editors", [])
        project = Project(owner=self.context["request"].user, **validated_data)

        with transaction.atomic():
            project.save()
            project.editors.add(*editors)
        return project

    def get_meta(self, project):
        return {"data_sources": {"count": project.data_source_count}}


class WranglingScriptSerializer(serializers.ModelSerializer):
    body = serializers.CharField(read_only=True)
    created_by = NestedRelatedModelSerializer(
        serializer=ProjectOwnerSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )

    class Meta:
        model = WranglingScript
        fields = (
            "id",
            "datasource",
            "name",
            "is_predefined",
            "created_by",
            "file",
            "body",
        )

    def create(self, validated_data):
        script = WranglingScript(created_by=self.context["request"].user, **validated_data)
        script.save()

        return script


class StepSerializer(serializers.ModelSerializer):
    exec_order = serializers.IntegerField(default=0)

    class Meta:
        model = models.DataSourceJobStep
        fields = (
            "script",
            "exec_order"
        )


class DataSourceJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True)
    result = serializers.FileField(read_only=True)
    error = serializers.CharField(read_only=True)
    job_state = serializers.CharField(read_only=True)

    class Meta:
        model = models.DataSourceJob
        fields = ("pk", "datasource", "steps", "job_state", "result", "error")

    def validate_steps(self, attr):
        if not attr:
            raise exceptions.ValidationError('At least single step is required')
        return attr

    def create(self, validated_data):
        steps = validated_data.pop('steps')
        job = models.DataSourceJob.objects.create(**validated_data)
        models.DataSourceJobStep.objects.bulk_create(
            self.create_steps(steps, job)
        )
        # services.schedule_worker_with(job)

        return job

    @staticmethod
    def create_steps(steps, job):
        for step in steps:
            step_instance = models.DataSourceJobStep()
            step_instance.script = step["script"]
            step_instance.datasource_job = job
            step_instance.exec_order = step["exec_order"]
            yield step_instance
