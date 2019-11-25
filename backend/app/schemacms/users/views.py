import auth0.v3
from django.db import transaction
from django_filters import rest_framework as django_filters
from rest_framework import decorators, mixins, permissions, response, status, serializers, viewsets

from schemacms.authorization import constants as auth_constants
from schemacms.users import signals
from .constants import UserRole, ErrorCode
from . import models as user_models, permissions as user_permissions, serializers as user_serializers
from .backend_management import user_mgtm_backend


class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except auth0.v3.Auth0Error as e:
            raise serializers.ValidationError({"email": [e.message]}, code=ErrorCode.AUTH0_USER_ALREADY_EXIST)
        headers = self.get_success_headers(serializer.data)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic()
    def perform_create(self, serializer):
        user = serializer.save(username=user_models.User.generate_random_username())
        signals.user_invited.send(sender=user_models.User, user=user, requester=self.request.user)
        return user

    @decorators.action(detail=True, methods=["post"])
    def deactivate(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deactivate(requester=self.request.user)
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = user_models.User.objects.none()
    serializer_class = user_serializers.CurrentUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    @decorators.action(
        detail=True, permission_classes=(permissions.IsAuthenticated,), url_path="reset-password"
    )
    def reset_password(self, request):
        auth_method = auth_constants.JWTAuthMethod.get_method_from_jwt_token(request.auth.decode())
        if auth_method == auth_constants.JWTAuthMethod.GMAIL:
            msg = "User registered by social providers should change password on provider's application"
            code = "invalidAuthMethod"
            raise serializers.ValidationError(msg, code=code)
        url = user_mgtm_backend.password_change_url(user=self.get_object())
        return response.Response({"ticket": url})
