from rest_framework.permissions import BasePermission, SAFE_METHODS

from ..users.models import User


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user_role = User.objects.get(id=request.user).role

        if user_role == 'admin':
            return True

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.owner == request.user
