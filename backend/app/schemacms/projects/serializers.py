import json

from django.db import transaction
from rest_framework import serializers, exceptions

from schemacms.projects import models
from .constants import ProcessingState, BlockTypes
from .models import DataSource, DataSourceMeta, Project, WranglingScript
from ..users.models import User
from ..utils.serializers import NestedRelatedModelSerializer
from .validators import CustomUniqueValidator, CustomUniqueTogetherValidator


class DataSourceMetaSerializer(serializers.ModelSerializer):
    filters = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DataSourceMeta
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
        model = models.DataSourceJobStep
        fields = ("script_name", "script", "body", "exec_order", "options")

    def get_script_name(self, obj):
        return obj.script.name


class ActiveJobSerializer(serializers.ModelSerializer):
    scripts = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.DataSourceJob
        fields = ("id", "scripts")

    def get_scripts(self, obj):
        return [
            {"id": step.script_id, "options": step.options, "exec_order": step.exec_order}
            for step in obj.steps.all()
        ]


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
    jobs_in_process = serializers.SerializerMethodField(read_only=True)
    active_job = ActiveJobSerializer(read_only=True)

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
            "modified",
            "meta_data",
            "error_log",
            "project",
            "status",
            "jobs_in_process",
            "active_job",
        )

        extra_kwargs = {
            "name": {"required": True, "allow_null": False, "allow_blank": False},
            "type": {"required": True, "allow_null": False},
            "file": {"required": True, "allow_null": False},
            "run_last_job": {"required": False, "allow_null": False, "allow_blank": False},
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

    def get_error_log(self, obj):
        return []

    def get_jobs_in_process(self, obj):
        if hasattr(obj, "jobs_in_process") and obj.jobs_in_process:
            return True
        return False

    @transaction.atomic()
    def save(self, *args, **kwargs):
        obj = super().save(*args, **kwargs)
        if "file" in self.validated_data:
            copy_steps = self.initial_data.get("run_last_job", False)
            obj.schedule_update_meta(copy_steps)
        return obj


class DataSourceDetailSerializer(DataSourceSerializer):
    project = serializers.SerializerMethodField(read_only=True)

    def get_project(self, obj):
        return obj.project_info


class ProjectOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "role")


class ProjectEditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "role")


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
            "data_sources": project.data_source_count,
            "pages": project.pages_count,
            "users": project.users_count,
            "charts": project.charts_count,
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
        fields = ("id", "datasource", "name", "is_predefined", "created_by", "file", "body", "specs")
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
        fields = ("id", "name", "is_predefined", "file", "body", "specs")


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
    datasource = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.DataSourceJob
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
        model = models.DataSourceMeta
        fields = ("items", "fields", "fields_names", "fields_with_urls", "preview", "status", "error")


class PublicApiUpdateJobMetaSerializer(serializers.ModelSerializer):
    preview = serializers.DictField(required=True)

    class Meta:
        model = models.DataSourceJobMetaData
        fields = ("items", "fields", "fields_names", "fields_with_urls", "preview")


class PublicApiDataSourceJobStateSerializer(serializers.ModelSerializer):
    job_state = serializers.ChoiceField(
        choices=[ProcessingState.PROCESSING, ProcessingState.SUCCESS, ProcessingState.FAILED]
    )
    result = serializers.CharField()

    class Meta:
        model = models.DataSourceJob
        fields = ("job_state", "result", "error")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        job_state = self.initial_data.get("job_state")
        job_state_available_fields = {
            ProcessingState.PROCESSING: [],
            ProcessingState.SUCCESS: ["result"],
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


class DataSourceFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DataSource
        fields = ("id", "name")


class FilterSerializer(serializers.ModelSerializer):
    datasource = NestedRelatedModelSerializer(
        serializer=DataSourceFilterSerializer(), queryset=models.DataSource.objects.all()
    )

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
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Filter.objects.all(),
                fields=("datasource", "name"),
                key_field_name="name",
                code="filterNameNotUnique",
                message="Filter with this name already exist in data source.",
            )
        ]

    def create(self, validated_data):
        filter_ = super().create(validated_data)
        filter_.datasource.create_dynamo_item()

        return filter_


class FilterDetailsSerializer(FilterSerializer):
    datasource = NestedRelatedModelSerializer(serializer=DataSourceFilterSerializer(), read_only=True)


# Pages


class FolderSerializer(serializers.ModelSerializer):
    created_by = NestedRelatedModelSerializer(
        serializer=DataSourceCreatorSerializer(),
        read_only=True,
        pk_field=serializers.UUIDField(format="hex_verbose"),
    )

    class Meta:
        model = models.Folder
        fields = ("id", "name", "created_by", "created", "modified", "project")
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Folder.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="folderNameUnique",
                message="Folder with this name already exist in project.",
            )
        ]

    def create(self, validated_data):
        folder = models.Folder(created_by=self.context["request"].user, **validated_data)
        folder.save()

        return folder


class FolderDetailSerializer(FolderSerializer):
    project = serializers.SerializerMethodField(read_only=True)

    def get_project(self, obj):
        return obj.project_info


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
            "folder",
            "title",
            "description",
            "keywords",
            "page_url",
            "created_by",
            "created",
            "modified",
            "meta",
        )
        extra_kwargs = {"folder": {"required": False, "allow_null": True}}
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Page.objects.all(),
                fields=("folder", "title"),
                key_field_name="title",
                code="pageNameUnique",
                message="Page with this title already exist in folder.",
            )
        ]

    def create(self, validated_data):
        page = models.Page(created_by=self.context["request"].user, **validated_data)
        page.save()

        return page

    def get_page_url(self, page):
        return page.page_url

    def get_meta(self, page):
        return {"blocks": page.blocks_count}


class PageFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Folder
        fields = ("id", "name", "project")


class PageDetailSerializer(PageSerializer):
    folder = NestedRelatedModelSerializer(serializer=PageFolderSerializer(), read_only=True)
    project = serializers.SerializerMethodField(read_only=True)

    class Meta(PageSerializer.Meta):
        fields = PageSerializer.Meta.fields + ("project",)

    def get_project(self, obj):
        return obj.project_info


class BlockImageSerializer(serializers.ModelSerializer):
    image_name = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = models.BlockImage
        fields = ("id", "image", "image_name", "exec_order")


class BlockSerializer(serializers.ModelSerializer):
    images_order = serializers.CharField(write_only=True, default="{}")

    class Meta:
        model = models.Block
        fields = ("id", "page", "name", "type", "content", "images_order", "is_active", "exec_order")
        extra_kwargs = {
            "page": {"required": False, "allow_null": True},
            "content": {"required": False, "allow_null": True, "allow_blank": False},
        }
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.Block.objects.all(),
                fields=("page", "name"),
                key_field_name="name",
                code="blockNameUnique",
                message="Block with this name already exist in page.",
            )
        ]

    def validate_type(self, type_):
        if type_ == BlockTypes.IMAGE and not self.context.get('view').request.FILES:
            message = f"Please select images to upload."
            raise serializers.ValidationError({"images": message}, code="noImages")

        if self.context.get('view').request.FILES and type_ != BlockTypes.IMAGE:
            message = f"For image upload use Image Uploaded block type."
            raise serializers.ValidationError({"type": message}, code="invalidType")

        return type_

    @staticmethod
    def create_images(images, images_order, block):
        for key, image in images.items():
            image_instance = models.BlockImage()
            image_instance.image = image
            image_instance.image_name = image.name
            image_instance.block = block
            image_instance.exec_order = images_order[key]
            yield image_instance

    @transaction.atomic()
    def save(self, *args, **kwargs):
        images = self.context.get('view').request.FILES
        images_order = json.loads(self.validated_data.pop("images_order", "{}"))
        block = super().save(**kwargs)

        delete_images = self.initial_data.get("delete_images")

        if delete_images:
            block.images.filter(id__in=delete_images.split(",")).delete()

        if images:
            models.BlockImage.objects.bulk_create(self.create_images(images, images_order, block))

        block.page.create_dynamo_item()

        return block

    @transaction.atomic()
    def update(self, instance, validated_data):
        new_type = validated_data.get("type", None)
        image_order = {
            key: value
            for key, value in json.loads(self.initial_data.get("images_order", "{}")).items()
            if not key.startswith("image")
        }

        if image_order:
            images = instance.images.filter(pk__in=image_order.keys())
            for image in images:
                image.exec_order = image_order[str(image.id)]
                image.save(update_fields=["exec_order"])

        if new_type and (instance.type == BlockTypes.IMAGE and new_type != BlockTypes.IMAGE):
            instance.images.all().delete()

        if new_type and (instance.type != BlockTypes.IMAGE and new_type == BlockTypes.IMAGE):
            instance.content = ""
            instance.save()

        return super().update(instance, validated_data)


class BlockPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = ("id", "title", "folder")


class BlockDetailSerializer(BlockSerializer):
    images = serializers.SerializerMethodField(read_only=True)
    page = NestedRelatedModelSerializer(serializer=BlockPageSerializer(), read_only=True)
    project = serializers.SerializerMethodField(read_only=True)

    class Meta(BlockSerializer.Meta):
        fields = BlockSerializer.Meta.fields + ("project", "images")

    def get_project(self, obj):
        return obj.project_info

    def get_images(self, instance):
        images = instance.images.all()
        return BlockImageSerializer(images, many=True).data
