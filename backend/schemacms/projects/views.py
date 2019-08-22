from rest_framework import (
    mixins,
    viewsets,
)

from .models import Projects
from .serializers import ProjectSerializer
from .permissions import IsAdminOrReadOnly


class ProjectViewSet(mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    """
    Creates new project
    """
    queryset = Projects.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsAdminOrReadOnly, )
