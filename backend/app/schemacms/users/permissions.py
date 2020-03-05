from rest_framework import exceptions, permissions

from ..projects.models import Project


def get_project(project_id):
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        raise exceptions.NotFound

    return project


class ProjectAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ["datasources", "folders", "users"]:
            project_id = view.kwargs.get("pk")
            project = get_project(project_id)
            return request.user.is_admin or request.user in project.editors.all()

        if view.action in ["pages_templates", "block_templates"]:
            return request.user.is_admin

        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_admin

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin or request.user in obj.editors.all()


class GeneralObjectAccessPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project_id = obj.project_info.get("id")
        project = get_project(project_id)
        return request.user.is_admin or request.user in project.editors.all()


class UsersViewSetPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role == "editor" and view.action == "retrieve":
            return True
        return request.user.is_admin

    def has_object_permission(self, request, view, obj):
        if request.user.role == "editor":
            obj_projects = obj.assigned_projects.all().values_list("id", flat=True)
            request_user_projects = request.user.assigned_projects.all().values_list("id", flat=True)
            return any(True for project in request_user_projects if project in obj_projects)
        return request.user.is_admin
