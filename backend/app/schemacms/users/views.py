from django import http
from rest_framework import (
    decorators,
    mixins,
    permissions,
    response,
    viewsets,
)
from . import (
    models as user_models,
    permissions as user_permissions,
    serializers as user_serializers
)
from .backend_management import user_mgtm_backend


class UserViewSet(mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    """
    Retrieves user account details
    """
    queryset = user_models.User.objects.all()
    serializer_class = user_serializers.UserSerializer
    permission_classes = (user_permissions.IsUserOrReadOnly,)


class MeViewSet(viewsets.GenericViewSet):
    queryset = user_models.User.objects.none()
    serializer_class = user_serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return response.Response(serializer.data)

    @decorators.action(detail=False, permission_classes=(permissions.IsAuthenticated,),
                       url_path='reset-password')
    def reset_password(self, request):
        url = user_mgtm_backend.password_change_url(user=request.user)
        return response.Response({'ticket': url})
