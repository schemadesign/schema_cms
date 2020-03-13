from rest_framework import response, serializers, status

from ..users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "role")


class IDNameSerializer(serializers.Serializer):
    id = serializers.IntegerField(min_value=0)
    name = serializers.CharField(max_length=200)


class CustomModelSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        abstract = True

    def get_created_by(self, obj):
        if getattr(obj, "created_by"):
            return obj.created_by.get_full_name()
        return None


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

    @staticmethod
    def get_active_inactive_lists(request):
        to_activate = request.data.get("active", [])
        to_deactivate = request.data.get("inactive", [])
        return to_activate, to_deactivate

    def set_is_active_fields(self, request, related_objects_name):
        instance = self.get_object()
        to_activate, to_deactivate = self.get_active_inactive_lists(request)

        getattr(instance, related_objects_name).filter(id__in=to_activate).update(is_active=True)
        getattr(instance, related_objects_name).filter(id__in=to_deactivate).update(is_active=False)

        instance.refresh_from_db()

        return instance

    def generate_action_post_get_response(self, request, related_objects_name, parent_object_name):
        instance = self.get_object()

        if request.method == "GET":
            if not getattr(instance, related_objects_name).exists():
                return response.Response({"project": instance.project_info, "results": []})

            serializer = self.get_serializer(instance=getattr(instance, related_objects_name), many=True)
            data = {"project": instance.project_info, "results": serializer.data}
            return response.Response(data, status=status.HTTP_200_OK)

        else:
            request.data[parent_object_name] = instance.id

            serializer = self.get_serializer(data=request.data, context=instance)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
