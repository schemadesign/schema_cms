from rest_framework import permissions

from ..projects.models import Project


class DataSourceListPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        project_id = view.kwargs.get("project_pk")

        return request.user.is_admin or Project.objects.filter(pk=project_id, editors=request.user).exists()

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin or request.user in obj.editors.all()
