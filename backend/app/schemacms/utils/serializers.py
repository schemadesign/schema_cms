from rest_framework import serializers


class NestedRelatedModelSerializer(serializers.PrimaryKeyRelatedField):
    def __init__(self, serializer, **kwargs):
        self.serializer = serializer
        super().__init__(**kwargs)

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, data):
        return self.serializer.to_representation(instance=data)


class ActionSerializerViewSetMixin:
    """Return serializer class based on action"""

    serializer_class_mapping = None

    def get_serializer_class(self):
        default_serializer_class = super().get_serializer_class()
        if self.serializer_class_mapping:
            return self.serializer_class_mapping.get(self.action, default_serializer_class)
        return default_serializer_class
