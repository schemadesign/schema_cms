from django.db import transaction
from rest_framework import serializers, exceptions

from . import models as ds_models
from .constants import ProcessingState, DataSourceType
from ..users.models import User
from ..utils.serializers import NestedRelatedModelSerializer, UserSerializer
from ..utils.validators import CustomUniqueTogetherValidator


class RawDataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ds_models.DataSource
        fields = ("id", "name")


class DataSourceMetaSerializer(serializers.ModelSerializer):
    filters = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ds_models.DataSourceMeta
        fields = (
            "items",
            "fields",
            "fields_names",
            "fields_with_urls",
            "preview",
            "filters",
            "status",
            "error",
        )

    def get_filters(self, meta):
        return meta.datasource.filters_count


class DataSourceCreatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class StepSerializer(serializers.ModelSerializer):
    exec_order = serializers.IntegerField(default=0)
    script_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ds_models.DataSourceJobStep
        fields = ("script_name", "script", "body", "exec_order", "options")

    def get_script_name(self, obj):
        return obj.script.name


class ActiveJobSerializer(serializers.ModelSerializer):
    scripts = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ds_models.DataSourceJob
        fields = ("id", "scripts")

    def get_scripts(self, obj):
        return [
            {"id": step.script_id, "options": step.options, "exec_order": step.exec_order}
            for step in obj.steps.all()
        ]


class DataSourceTagSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", default="", read_only=True)

    class Meta:
        model = ds_models.DataSourceTag
        fields = ("category", "category_name", "value")


class DataSourceSerializer(serializers.ModelSerializer):
    meta_data = DataSourceMetaSerializer(read_only=True)
    file_name = serializers.SerializerMethodField()
    created_by = NestedRelatedModelSerializer(
        serializer=DataSourceCreatorSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )
    jobs_state = serializers.SerializerMethodField()
    active_job = serializers.SerializerMethodField()
    tags = DataSourceTagSerializer(read_only=True, many=True)

    class Meta:
        model = ds_models.DataSource
        fields = (
            "id",
            "name",
            "created_by",
            "type",
            "file",
            "file_name",
            "google_sheet",
            "created",
            "modified",
            "meta_data",
            "project",
            "jobs_state",
            "active_job",
            "tags",
        )

        extra_kwargs = {
            "name": {"required": True, "allow_null": False, "allow_blank": False},
            "run_last_job": {"required": False, "allow_null": False, "allow_blank": False},
        }
        validators = [
            CustomUniqueTogetherValidator(
                queryset=ds_models.DataSource.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="dataSourceProjectNameUnique",
                message="DataSource with this name already exist in project.",
            )
        ]

    def validate(self, attrs):
        states = [ProcessingState.PROCESSING, ProcessingState.PENDING]

        if not self.instance:
            return super().validate(attrs)

        if attrs.get("file", None) and self.instance.jobs.filter(job_state__in=states).exists():
            message = "You can't re-upload file when job is processing"
            raise serializers.ValidationError({"file": message}, code="fileInProcessing")

        return super().validate(attrs)

    def validate_project(self, project):
        user = self.context["request"].user
        if not project.user_has_access(user):
            raise exceptions.PermissionDenied
        return project

    def get_file_name(self, obj):
        if obj.file:
            _, file_name = obj.get_original_file_name()
            return file_name

    def get_active_job(self, obj: ds_models.DataSource):
        if job := obj.get_active_job():
            return ActiveJobSerializer(job, read_only=True).data
        else:
            return None

    def get_jobs_state(self, obj):
        last_job = obj.last_job

        jobs_state = {
            "any_job_in_process": obj.jos_in_process if hasattr(obj, "jos_in_process") else False,
            "last_job_status": last_job.job_state if last_job else None,
            "error": last_job.error if last_job else None,
        }

        return jobs_state

    @transaction.atomic()
    def save(self, *args, **kwargs):
        obj = super().save(*args, **kwargs)

        if (tags := self.initial_data.get("tags")) is not None:
            obj.add_tags(tags)

        if self.validated_data.get("file", None) or self.validated_data.get("google_sheet", None):
            copy_steps = self.initial_data.get("run_last_job", False)
            obj.schedule_update_meta(copy_steps)

        return obj


class DataSourceDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ds_models.DataSourceDescription
        fields = ("datasource", "data")


class DataSourceDetailSerializer(DataSourceSerializer):
    project = serializers.SerializerMethodField(read_only=True)

    def get_project(self, obj):
        return obj.project_info

    @transaction.atomic()
    def update(self, instance, validated_data):

        self.clean_type_assets(instance, validated_data)

        return super().update(instance, validated_data)

    @staticmethod
    def clean_type_assets(instance: ds_models.DataSource, validated_data):
        if (type_ := validated_data.get("type")) and type_ != instance.type:
            if type_ == DataSourceType.FILE:
                instance.google_sheet = ""

            if type_ == DataSourceType.GOOGLE_SHEET:
                instance.file = None

            instance.save()


class WranglingScriptSerializer(serializers.ModelSerializer):
    body = serializers.CharField(read_only=True)
    created_by = NestedRelatedModelSerializer(
        serializer=UserSerializer(), read_only=True, pk_field=serializers.UUIDField(format="hex_verbose")
    )
    is_predefined = serializers.BooleanField(read_only=True)
    datasource = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ds_models.WranglingScript
        fields = ("id", "datasource", "name", "is_predefined", "created_by", "file", "body", "specs")
        extra_kwargs = {"name": {"required": False, "allow_null": True}}

    def create(self, validated_data):
        datasource = self.initial_data["datasource"]

        script = ds_models.WranglingScript(
            created_by=self.context["request"].user, datasource=datasource, **validated_data
        )
        script.is_predefined = False
        script.save()

        return script


class DataSourceScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ds_models.WranglingScript
        fields = ("id", "name", "is_predefined", "file", "body", "specs")


class CreateJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True)

    class Meta:
        model = ds_models.DataSourceJob
        fields = ("id", "description", "steps")

    def validate_steps(self, attr):
        if not attr:
            raise exceptions.ValidationError("At least single step is required", code="missingSteps")
        return attr

    @transaction.atomic()
    def create(self, validated_data):
        datasource = self.initial_data["datasource"]
        steps = validated_data.pop("steps")
        job = datasource.create_job(**validated_data)
        ds_models.DataSourceJobStep.objects.bulk_create(self.create_steps(steps, job))
        return job

    @staticmethod
    def create_steps(steps, job):
        for step_dict in steps:
            step_instance = ds_models.DataSourceJobStep()
            for k, v in step_dict.items():
                setattr(step_instance, k, v)
            step_instance.body = step_dict["script"].body
            step_instance.datasource_job = job
            yield step_instance


class JobDataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ds_models.DataSource
        fields = ("id", "project")


class DataSourceJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True, read_only=True)
    result = serializers.FileField(read_only=True)
    error = serializers.CharField(read_only=True)
    job_state = serializers.CharField(read_only=True)
    datasource = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ds_models.DataSourceJob
        fields = (
            "id",
            "datasource",
            "description",
            "steps",
            "job_state",
            "result",
            "error",
            "source_file_url",
            "created",
        )


class JobDetailSerializer(DataSourceJobSerializer):
    project = serializers.SerializerMethodField(read_only=True)

    class Meta(DataSourceJobSerializer.Meta):
        fields = DataSourceJobSerializer.Meta.fields + ("project",)

    def get_project(self, obj):
        return obj.project_info


class PublicApiUpdateMetaSerializer(serializers.ModelSerializer):
    preview = serializers.DictField(required=False)

    class Meta:
        model = ds_models.DataSourceMeta
        fields = ("items", "fields", "fields_names", "fields_with_urls", "preview", "status", "error")


class PublicApiUpdateJobMetaSerializer(serializers.ModelSerializer):
    preview = serializers.DictField(required=True)

    class Meta:
        model = ds_models.DataSourceJobMetaData
        fields = ("items", "fields", "fields_names", "fields_with_urls", "preview")


class PublicApiDataSourceJobStateSerializer(serializers.ModelSerializer):
    job_state = serializers.ChoiceField(
        choices=[ProcessingState.PROCESSING, ProcessingState.SUCCESS, ProcessingState.FAILED]
    )
    result = serializers.CharField()
    result_parquet = serializers.CharField()

    class Meta:
        model = ds_models.DataSourceJob
        fields = ("job_state", "result", "result_parquet", "error")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        job_state = self.initial_data.get("job_state")
        job_state_available_fields = {
            ProcessingState.PROCESSING: [],
            ProcessingState.SUCCESS: ["result", "result_parquet"],
            ProcessingState.FAILED: ["error"],
        }
        available_fields = job_state_available_fields.get(job_state, []) + ["job_state"]
        exclude_fields = self.fields.keys() - available_fields
        for field_name in exclude_fields:
            del self.fields[field_name]

    def validate_job_state(self, new_job_state):
        job = self.instance
        available_states = (tr.target for tr in job.get_available_job_state_transitions())
        if new_job_state not in available_states:
            raise serializers.ValidationError("Invalid job state transition")
        return new_job_state

    @transaction.atomic()
    def save(self, **kwargs):
        job_state = self.validated_data.pop("job_state")
        for field_name, val in self.validated_data.items():
            setattr(self.instance, field_name, val)
        job_state_action = {
            ProcessingState.PROCESSING: self.instance.processing,
            ProcessingState.SUCCESS: self.instance.success,
            ProcessingState.FAILED: self.instance.fail,
        }
        job_state_action[job_state]()
        return super().save(**kwargs)


# Filters


class DataSourceNestedFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ds_models.DataSource
        fields = ("id", "name")


class FilterSerializer(serializers.ModelSerializer):
    datasource = NestedRelatedModelSerializer(
        serializer=DataSourceNestedFieldSerializer(), queryset=ds_models.DataSource.objects.all()
    )

    class Meta:
        model = ds_models.Filter
        fields = (
            "id",
            "datasource",
            "name",
            "filter_type",
            "field",
            "field_type",
            "unique_items",
            "is_active",
            "created",
            "modified",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=ds_models.Filter.objects.all(),
                fields=("datasource", "name"),
                key_field_name="name",
                code="filterNameNotUnique",
                message="Filter with this name already exist in data source.",
            )
        ]


class FilterDetailsSerializer(FilterSerializer):
    datasource = NestedRelatedModelSerializer(serializer=DataSourceNestedFieldSerializer(), read_only=True)
