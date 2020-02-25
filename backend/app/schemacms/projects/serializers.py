import json

from django.db import transaction
from rest_framework import serializers

from . import models
from .constants import BlockTypes
from ..utils.serializers import NestedRelatedModelSerializer, UserSerializer
from ..utils.validators import CustomUniqueValidator, CustomUniqueTogetherValidator


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


# Pages


class FolderSerializer(serializers.ModelSerializer):
    created_by = NestedRelatedModelSerializer(
        serializer=UserSerializer(), read_only=True, pk_field=serializers.UUIDField(format="hex_verbose")
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
        serializer=UserSerializer(), read_only=True, pk_field=serializers.UUIDField(format="hex_verbose")
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
        if type_ == BlockTypes.IMAGE and not self.context.get("view").request.FILES:
            message = f"Please select images to upload."
            raise serializers.ValidationError({"images": message}, code="noImages")

        if self.context.get("view").request.FILES and type_ != BlockTypes.IMAGE:
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
        images = self.context.get("view").request.FILES
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
