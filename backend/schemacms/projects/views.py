from rest_framework import (
    permissions,
    viewsets,
)

from ..users.constants import UserRole

from .models import Project
from .serializers import ProjectSerializer
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
