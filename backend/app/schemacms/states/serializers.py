from django.db import transaction
from rest_framework import serializers

from . import models
from ..datasources import models as ds_models
from ..utils.validators import CustomUniqueTogetherValidator


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
