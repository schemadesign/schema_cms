from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_admin

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_admin

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_admin


class IsAdminOrIsEditor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_admin or request.user.is_editor

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin or self.is_project_editor(request.user, obj)

    @staticmethod
    def is_project_editor(user, obj):
        return user in obj.project.editors.all()
