from rest_framework import permissions


class TagPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_admin

    def has_object_permission(self, request, view, obj):
        return request.user.is_admin
