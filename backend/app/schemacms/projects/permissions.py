from rest_framework.permissions import BasePermission


class HasProjectPermission(BasePermission):
    def has_permission(self, request, view):
        return view.project.user_has_access(request.user)
