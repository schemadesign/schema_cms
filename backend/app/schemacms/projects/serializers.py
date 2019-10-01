import django_fsm
from django.db import transaction
from rest_framework import serializers, exceptions, validators

from schemacms.projects import models
from schemacms.projects import services
from .models import DataSource, DataSourceMeta, Project
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
            "project",
        )

        extra_kwargs = {
            "name": {"required": True, "allow_null": False, "allow_blank": False},
            "type": {"required": True, "allow_null": False},
            "file": {"required": True, "allow_null": False},
            "project": {"read_only": True},
        }
        validators = [
            validators.UniqueTogetherValidator(queryset=DataSource.objects.all(), fields=('name', 'project'))
        ]

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
        fields = ("id", "name", "type", "file", "meta_data", "project")
        extra_kwargs = {
            "name": {"required": False, "allow_null": True},
            "type": {"required": False, "allow_null": True},
            "file": {"required": False, "allow_null": True},
        }
        validators = []  # do not validate tuple of (name, project)

    def validate_project(self, project):
        user = self.context["request"].user
        if not project.user_has_access(user):
            raise exceptions.PermissionDenied
        return project


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


class DataSourceScriptSerializer(serializers.Serializer):
    key = serializers.CharField()
    body = serializers.SerializerMethodField()

    def get_body(self, attr):
        return attr['resource'].getvalue(attr['ref_key'])


class DataSourceScriptUploadSerializer(serializers.Serializer):
    script = serializers.FileField()

    def update(self, instance, validated_data):
        script_file = validated_data.get('script')
        services.scripts.resources.get('s3').upload(instance, script_file)
        return instance


class StepSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=255)
    exec_order = serializers.IntegerField(default=0)

    def validate_key(self, attr):
        spliced = attr.split(':')
        if len(spliced) != 2:
            raise exceptions.ValidationError('Invalid key format')
        return attr


class DataSourceJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True)

    class Meta:
        model = models.DataSourceJob
        fields = ('pk', 'steps', 'job_state')

    def validate_steps(self, attr):
        if not attr:
            raise exceptions.ValidationError('At least single step is required')
        return attr

    def create(self, validated_data):
        steps = validated_data.pop('steps')
        job = models.DataSourceJob.objects.create(**validated_data)
        for step in steps:
            step_key = step['key']
            step_resource, ref_key = services.scripts.responsible(key=step_key)
            models.DataSourceJobStep.objects.create(
                datasource_job=job,
                key=step_key,
                exec_order=step['exec_order'],
                body=step_resource.getvalue(ref_key),
            )
        return job
