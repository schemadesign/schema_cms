from django.shortcuts import render
from rest_framework import mixins
from rest_framework import viewsets
from .models import Projects
from .serializers import ProjectSerializer
from .serializers import CreateProjectSerializer


# Create your views here.
class ProjectViewSet(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    """
    Updates and retrieves user accounts
    """
    queryset = Projects.objects.all()
    serializer_class = ProjectSerializer


class ProjectCreateViewSet(mixins.ListModelMixin,
                           mixins.CreateModelMixin,
                           viewsets.GenericViewSet):
    """
    Create new Project
    """
    queryset = Projects.objects.all()
    serializer_class = CreateProjectSerializer
