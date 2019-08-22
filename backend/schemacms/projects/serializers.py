from rest_framework import serializers

from .models import Projects
from ..users.models import User


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault(),
        pk_field=serializers.UUIDField(),
    )

    class Meta:
        model = Projects
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "status",
            "owner",
            "created",
            "modified",
        )
