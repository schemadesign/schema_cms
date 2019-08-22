from rest_framework import serializers
from .models import Projects


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ("id", "title", "slug", "description", "status", "owner", "created", "modified")


class CreateProjectSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        project = Projects.objects.create(**validated_data)
        return project

    class Meta:
        model = Projects
        fields = ("id", "title", "slug", "description", "status", "owner", "created", "modified")
