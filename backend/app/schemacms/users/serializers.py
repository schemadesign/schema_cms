from rest_framework import serializers

from .models import User
from schemacms.authorization import constants as auth_constants


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role")
        read_only_fields = ("username", "role")


class UserSerializerForAdmin(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role")
        read_only_fields = ("username",)


class CurrentUserSerializer(serializers.ModelSerializer):
    auth_method = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role", "auth_method")
        read_only_fields = ("username", "role")

    def get_auth_method(self, obj):
        try:
            token = self.context["request"].auth
            if not token:
                return None
        except KeyError:
            return None
        try:
            auth_method = auth_constants.JWTAuthMethod.get_method_from_jwt_token(token.decode())
        except ValueError:
            return None
        return auth_method
