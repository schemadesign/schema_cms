from rest_framework.permissions import BasePermission, SAFE_METHODS

from ..users.constants import UserRole


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user.role == UserRole.ADMIN

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user
