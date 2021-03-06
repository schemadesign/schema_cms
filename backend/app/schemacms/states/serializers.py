from django.db import transaction
from rest_framework import serializers

from . import models
from ..datasources import models as ds_models
from ..utils.validators import CustomUniqueTogetherValidator
from ..utils.serializers import NestedRelatedModelSerializer, ReadOnlySerializer
from ..datasources.serializers import RawDataSourceSerializer


class StateFilterSerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.StateFilter
        fields = ("filter", "values")

    def get_values(self, filter_):
        return filter_.condition["values"]


class StateTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StateTag
        fields = ("category", "value")


class StateSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    filters = serializers.SerializerMethodField(read_only=True)
    tags = StateTagSerializer(read_only=True, many=True)
    datasource = NestedRelatedModelSerializer(
        serializer=RawDataSourceSerializer(), queryset=ds_models.DataSource.objects.all()
    )

    class Meta:
        model = models.State
        fields = (
            "id",
            "name",
            "datasource",
            "description",
            "source_url",
            "author",
            "is_public",
            "created",
            "tags",
            "fields",
            "filters",
        )
        validators = [
            CustomUniqueTogetherValidator(
                queryset=models.State.objects.all(),
                fields=("name", "datasource"),
                key_field_name="name",
                code="stateNameNotUnique",
                message="State with this name already exist in data source.",
            )
        ]

    @transaction.atomic()
    def save(self, *args, **kwargs):
        obj = super().save(*args, **kwargs)

        if (tags := self.initial_data.get("tags")) is not None:
            obj.add_tags(tags)

        if "filters" in self.initial_data:
            obj.filters.all().delete()
            filters = self.initial_data.pop("filters")

            for filter_ in filters:
                filter_instance = ds_models.Filter.objects.get(pk=filter_["filter"])
                models.StateFilter.objects.create(
                    **{
                        "state": obj,
                        "filter": filter_instance,
                        "filter_type": filter_instance.filter_type,
                        "field": filter_instance.field,
                        "field_type": filter_instance.field_type,
                        "condition": {"values": filter_["values"]},
                    }
                )

        return obj

    def get_author(self, state):
        return state.author.get_full_name()

    def get_filters(self, state):
        state_filters = models.StateFilter.objects.filter(state=state)
        return StateFilterSerializer(state_filters, many=True).data


class StatePageAdditionalDataSerializer(ReadOnlySerializer):
    datasource = serializers.CharField(source="datasource.name")

    class Meta:
        model = models.State
        fields = ("id", "name", "datasource")
