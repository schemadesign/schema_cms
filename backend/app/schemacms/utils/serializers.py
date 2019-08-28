from rest_framework import serializers


class NestedRelatedModelSerializer(serializers.PrimaryKeyRelatedField):
    def __init__(self, serializer, **kwargs):
        self.serializer = serializer
        super().__init__(**kwargs)

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, data):
        return self.serializer.to_representation(instance=data)
