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


class UserViewSet(mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    """
    Retrieves user account details
    """
    queryset = user_models.User.objects.all()
    serializer_class = user_serializers.UserSerializer
    permission_classes = (user_permissions.IsUserOrReadOnly,)

    @decorators.action(detail=False, permission_classes=(permissions.IsAuthenticated,))
    def me(self, request):
        instance = request.user
        serializer = self.get_serializer(instance)
        return response.Response(serializer.data)
