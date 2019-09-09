from rest_framework import decorators, mixins, permissions, response, viewsets
from . import models as user_models, permissions as user_permissions, serializers as user_serializers
from .backend_management import user_mgtm_backend


class UserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    Retrieves and updates user account details
    """

    queryset = user_models.User.objects.all()
    serializer_class = user_serializers.UserSerializer
    permission_classes = (user_permissions.IsAdminOrReadOnly,)

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return user_serializers.UserSerializerForAdmin
        return super().get_serializer_class()


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
