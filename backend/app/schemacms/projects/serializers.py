from django.db import transaction
from rest_framework import serializers, exceptions

from schemacms.projects import models
from .constants import DataSourceJobState, BlockTypes
from .models import DataSource, DataSourceMeta, Project, WranglingScript
from ..users.models import User
from ..utils.serializers import NestedRelatedModelSerializer
from .validators import CustomUniqueValidator, CustomUniqueTogetherValidator


class DataSourceMetaSerializer(serializers.ModelSerializer):
    filters = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DataSourceMeta
        fields = ("items", "fields", "preview", "filters")

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
        model = models.DataSourceJobStep
        fields = ("script_name", "script", "body", "exec_order", "options")

    def get_script_name(self, obj):
        return obj.script.name


class DataSourceLastJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True)

    class Meta:
        model = models.DataSourceJob
        fields = ("id", "job_state", "created", "modified", "steps")


class DataSourceSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True, default="done")
    meta_data = DataSourceMetaSerializer(read_only=True)
    file_name = serializers.SerializerMethodField(read_only=True)
    created_by = NestedRelatedModelSerializer(
        serializer=DataSourceCreatorSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )
    error_log = serializers.SerializerMethodField()
    jobs = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DataSource
        fields = (
            "id",
            "name",
            "created_by",
            "type",
            "file",
            "file_name",
            "created",
            "meta_data",
            "error_log",
            "project",
            "jobs",
            "status",
            "active_job",
        )

        extra_kwargs = {
            "name": {"required": True, "allow_null": False, "allow_blank": False},
            "type": {"required": True, "allow_null": False},
            "file": {"required": True, "allow_null": False},
        }
        validators = [
            CustomUniqueTogetherValidator(
                queryset=DataSource.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="dataSourceProjectNameUnique",
                message="DataSource with this name already exist in project.",
            )
        ]

    def validate(self, attrs):
        states = [DataSourceJobState.PROCESSING, DataSourceJobState.PENDING]

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

    def get_error_log(self, obj):
        return []

    def get_jobs(self, obj):
        if obj.jobs.exists():
            return DataSourceLastJobSerializer(obj.jobs.order_by("-created")[:5], many=True).data
        else:
            return []

    @transaction.atomic()
    def update(self, instance, validated_data):
        file = validated_data.get("file", None)
        if file:
            instance.update_meta(file=file, file_name=file.name)
            file.seek(0)
        obj = super().update(instance=instance, validated_data=validated_data)
        return obj


class ProjectOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class ProjectEditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class ProjectSerializer(serializers.ModelSerializer):
    owner = NestedRelatedModelSerializer(
        serializer=ProjectOwnerSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )
    editors = NestedRelatedModelSerializer(
        read_only=True,
        many=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
        serializer=ProjectEditorSerializer(),
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
        extra_kwargs = {
            "title": {"validators": [CustomUniqueValidator(queryset=Project.objects.all(), prefix="project")]}
        }

    def create(self, validated_data):
        project = Project(owner=self.context["request"].user, **validated_data)
        project.save()

        return project

    def get_meta(self, project):
        return {
            "data_sources": {"count": project.data_source_count},
            "pages": {"count": project.pages_count},
        }


class WranglingScriptSerializer(serializers.ModelSerializer):
    body = serializers.CharField(read_only=True)
    created_by = NestedRelatedModelSerializer(
        serializer=ProjectOwnerSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )
    is_predefined = serializers.BooleanField(read_only=True)
    datasource = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WranglingScript
        fields = ("id", "datasource", "name", "is_predefined", "created_by", "file", "body")
        extra_kwargs = {"name": {"required": False, "allow_null": True}}

    def create(self, validated_data):
        datasource = self.initial_data["datasource"]

        script = WranglingScript(
            created_by=self.context["request"].user, datasource=datasource, **validated_data
        )
        script.is_predefined = False
        script.save()

        return script


class DataSourceScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = WranglingScript
        fields = ("id", "name", "is_predefined", "file", "body")


class CreateJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True)

    class Meta:
        model = models.DataSourceJob
        fields = ("id", "description", "steps")

    def validate_steps(self, attr):
        if not attr:
            raise exceptions.ValidationError('At least single step is required', code="missingSteps")
        return attr

    @transaction.atomic()
    def create(self, validated_data):
        datasource = self.initial_data["datasource"]
        steps = validated_data.pop('steps')
        job = datasource.create_job(**validated_data)
        models.DataSourceJobStep.objects.bulk_create(self.create_steps(steps, job))
        return job

    @staticmethod
    def create_steps(steps, job):
        for step_dict in steps:
            step_instance = models.DataSourceJobStep()
            for k, v in step_dict.items():
                setattr(step_instance, k, v)
            step_instance.body = step_dict["script"].body
            step_instance.datasource_job = job
            yield step_instance


class JobDataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DataSource
        fields = ("id", "project")


class DataSourceJobSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True, read_only=True)
    result = serializers.FileField(read_only=True)
    error = serializers.CharField(read_only=True)
    job_state = serializers.CharField(read_only=True)
    project = serializers.SerializerMethodField(read_only=True)
    datasource = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.DataSourceJob
        fields = (
            "id",
            "datasource",
            "project",
            "description",
            "steps",
            "job_state",
            "result",
            "error",
            "source_file_url",
            "created",
        )

    def get_project(self, obj):
        return obj.datasource.project_id


class PublicApiDataSourceJobStateSerializer(serializers.ModelSerializer):
    job_state = serializers.ChoiceField(
        choices=[DataSourceJobState.PROCESSING, DataSourceJobState.SUCCESS, DataSourceJobState.FAILED]
    )
    result = serializers.CharField()

    class Meta:
        model = models.DataSourceJob
        fields = ("job_state", "result", "error")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        job_state = self.initial_data.get("job_state")
        job_state_available_fields = {
            DataSourceJobState.PROCESSING: [],
            DataSourceJobState.SUCCESS: ["result"],
            DataSourceJobState.FAILED: ["error"],
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
            DataSourceJobState.PROCESSING: self.instance.processing,
            DataSourceJobState.SUCCESS: self.instance.success,
            DataSourceJobState.FAILED: self.instance.fail,
        }
        job_state_action[job_state]()
        return super().save(**kwargs)


# Filters


class DataSourceFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DataSource
        fields = ("id", "name")


class FilterSerializer(serializers.ModelSerializer):
    datasource = NestedRelatedModelSerializer(serializer=DataSourceFilterSerializer(), read_only=True)

    class Meta:
        model = models.Filter
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

    def create(self, validated_data):
        datasource = self.initial_data["datasource"]

        filter_ = models.Filter(datasource=datasource, **validated_data)
        filter_.save()
        datasource.create_meta_file()

        return filter_


# Pages


class DirectorySerializer(serializers.ModelSerializer):
    created_by = NestedRelatedModelSerializer(
        serializer=DataSourceCreatorSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )

    class Meta:
        model = models.Directory
        fields = ("id", "name", "created_by", "created", "modified", "project")

    def create(self, validated_data):
        directory = models.Directory(created_by=self.context["request"].user, **validated_data)
        directory.save()

        return directory


class DirectoryDetailSerializer(DirectorySerializer):
    class Meta(DirectorySerializer.Meta):
        read_only_fields = ("project",)


class PageSerializer(serializers.ModelSerializer):
    created_by = NestedRelatedModelSerializer(
        serializer=DataSourceCreatorSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )
    page_url = serializers.SerializerMethodField(read_only=True)
    meta = serializers.SerializerMethodField()

    class Meta:
        model = models.Page
        fields = (
            "id",
            "directory",
            "title",
            "description",
            "keywords",
            "page_url",
            "created_by",
            "created",
            "modified",
            "meta",
        )
        extra_kwargs = {"directory": {"required": False, "allow_null": True}}

    def create(self, validated_data):
        page = models.Page(created_by=self.context["request"].user, **validated_data)
        page.save()

        return page

    def get_page_url(self, page):
        return page.page_url

    def get_meta(self, page):
        return {"blocks": page.blocks_count}


class PageDirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Directory
        fields = ("id", "name", "project")


class PageDetailSerializer(PageSerializer):
    directory = NestedRelatedModelSerializer(serializer=PageDirectorySerializer(), read_only=True)


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Block
        fields = ("id", "page", "name", "type", "content", "image", "is_active")
        extra_kwargs = {"page": {"required": False, "allow_null": True}}

    def validate_type(self, type_):
        if type_ == BlockTypes.IMAGE and not self.initial_data.get("image", None):
            message = f"Please select image to upload."
            raise serializers.ValidationError({"image": message}, code="noImage")

        if self.initial_data.get("image", None) and type_ != BlockTypes.IMAGE:
            message = f"For image upload use Image Uploaded block type."
            raise serializers.ValidationError({"type": message}, code="invalidType")

        return type_

    @transaction.atomic()
    def update(self, instance, validated_data):
        new_type = validated_data.get("type")

        if new_type and (instance.type == BlockTypes.IMAGE and new_type != BlockTypes.IMAGE):
            instance.image.delete()

        return super().update(instance, validated_data)


class BlockPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = ("id", "title", "directory")


class BlockDetailSerializer(BlockSerializer):
    page = NestedRelatedModelSerializer(serializer=BlockPageSerializer(), read_only=True)
