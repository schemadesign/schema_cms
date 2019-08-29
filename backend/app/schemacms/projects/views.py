from rest_framework import (
    permissions,
    viewsets,
)

from ..users.constants import UserRole

from .models import DataSource, Project
from .serializers import DataSourceSerializer, ProjectSerializer
from .permissions import IsAdminOrReadOnly


class ProjectViewSet(viewsets.ModelViewSet):
    """
    Creates new project
    """
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly, )
    queryset = Project.objects.none()

    def get_queryset(self):
        if self.request.user.role == UserRole.ADMIN:
            return Project.objects.all()
        elif self.request.user.role == UserRole.EDITOR:
            return Project.objects.filter(editors=self.request.user)
        else:
            return Project.objects.none()


class DataSourceViewSet(viewsets.ModelViewSet):
    serializer_class = DataSourceSerializer
    queryset = DataSource.objects.all()
