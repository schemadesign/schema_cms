from rest_framework import (
    permissions,
    viewsets,
)

from .models import Projects
from .serializers import ProjectSerializer
from .permissions import IsAdminOrReadOnly


class ProjectViewSet(viewsets.ModelViewSet):
    """
    Creates new project
    """
    queryset = Projects.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, )
