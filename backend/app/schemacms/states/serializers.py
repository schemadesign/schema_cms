from django.db import transaction
from rest_framework import serializers

from . import models
from ..datasources import models as ds_models
from ..utils.serializers import NestedRelatedModelSerializer, IDNameSerializer
from ..utils.validators import CustomUniqueTogetherValidator


class TagSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    value = serializers.CharField(max_length=150, required=True)
    exec_order = serializers.IntegerField(required=True)


class TagsListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = models.TagsList
        fields = ("id", "datasource", "name", "is_active", "tags")
        extra_kwargs = {"datasource": {"required": False, "allow_null": True}}
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.TagsList.objects.all(),
                fields=("name", "datasource"),
                key_field_name="name",
                code="tagsListNameNotUnique",
                message="TagsList with this name already exist in data source.",
            )
        ]

    @transaction.atomic()
    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        tags_list = models.TagsList.objects.create(**validated_data)
        if tags:
            models.Tag.objects.bulk_create(self.create_tags(tags, tags_list))

        return tags_list

    @transaction.atomic()
    def update(self, instance, validated_data):
        tags_to_delete = self.initial_data.pop("delete_tags", [])
        tags = validated_data.pop("tags", [])
        if tags_to_delete:
            instance.tags.filter(id__in=tags_to_delete).delete()

        if tags:
            tags_to_update = [tag for tag in tags if "id" in tag]
            tags_to_create = [tag for tag in tags if "id" not in tag]

            if tags_to_update:
                for tag in tags_to_update:
                    instance.tags.filter(id=tag["id"]).update(
                        value=tag["value"], exec_order=tag["exec_order"]
                    )

            if tags_to_create:
                models.Tag.objects.bulk_create(self.create_tags(tags_to_create, instance))

        return super().update(instance, validated_data)

    @staticmethod
    def create_tags(tags, list_):
        for tag in tags:
            tag_instance = models.Tag()
            tag_instance.value = tag["value"]
            tag_instance.tags_list = list_
            tag_instance.exec_order = tag["exec_order"]
            yield tag_instance


class TagsListDetailSerializer(TagsListSerializer):
    datasource = NestedRelatedModelSerializer(serializer=IDNameSerializer(), read_only=True)

    class Meta(TagsListSerializer.Meta):
        fields = TagsListSerializer.Meta.fields + ("datasource",)


class InStateFilterSerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.InStateFilter
        fields = ("filter", "values")

    def get_values(self, filter_):
        return filter_.condition["values"]


class StateSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    active_tags = serializers.ListField(required=False, allow_empty=True)
    filters = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.State
        fields = (
            "id",
            "name",
            "project",
            "datasource",
            "description",
            "source_url",
            "author",
            "is_public",
            "created",
            "active_tags",
            "filters",
        )
        extra_kwargs = {"project": {"required": False, "allow_null": True}}
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.State.objects.all(),
                fields=("project", "name"),
                key_field_name="name",
                code="stateNameNotUnique",
                message="State with this name already exist in project.",
            )
        ]

    def create(self, validated_data):
        state = models.State(author=self.context["request"].user, **validated_data)
        state.save()

        return state

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            if "filters" in self.initial_data:
                instance.filters.clear()
                filters = self.initial_data.pop("filters")
                for filter_ in filters:
                    filter_instance = ds_models.Filter.objects.get(pk=filter_["filter"])
                    instance.filters.add(
                        filter_instance,
                        through_defaults={
                            "filter_type": filter_instance.filter_type,
                            "field": filter_instance.field,
                            "field_type": filter_instance.field_type,
                            "condition": {"values": filter_["values"]},
                        },
                    )
        return instance

    def get_author(self, state):
        return state.author.get_full_name()

    def get_filters(self, state):
        state_filters = models.InStateFilter.objects.filter(state=state)
        return InStateFilterSerializer(state_filters, many=True).data
