from django_filters import rest_framework as django_filters
from rest_framework import decorators, mixins, permissions, response, status, viewsets
from .constants import UserRole
from . import models as user_models, permissions as user_permissions, serializers as user_serializers
from .backend_management import user_mgtm_backend


class UserViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    """
    Retrieves, updates and deactivates user account details
    """

    queryset = user_models.User.objects.all().app_users().activated()
    serializer_class = user_serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsAdminOrReadOnly)
    filter_backends = (django_filters.DjangoFilterBackend,)
    filterset_fields = ("role",)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list':
            qs = qs.exclude(pk=self.request.user.pk).order_by("first_name", "last_name")
        return qs

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return user_serializers.UserSerializerForAdmin
        return super().get_serializer_class()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_role = request.data.get("role", None)

        if new_role == UserRole.EDITOR and instance.role == UserRole.ADMIN:
            return response.Response(
                "Only superadmin can change admin role", status=status.HTTP_403_FORBIDDEN
            )
        else:
            return super().update(request, args, kwargs)

    @decorators.action(detail=True, methods=["post"])
    def deactivate(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deactivate(requester=self.request.user)
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = user_models.User.objects.none()
    serializer_class = user_serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    @decorators.action(
        detail=True, permission_classes=(permissions.IsAuthenticated,), url_path="reset-password"
    )
    def reset_password(self, request):
        url = user_mgtm_backend.password_change_url(user=self.get_object())
        return response.Response({"ticket": url})
