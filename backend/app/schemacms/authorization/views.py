from django import shortcuts
from django.core import signing
from django.utils import timezone
from rest_framework import response, serializers, views

from schemacms.authorization import serializers as auth_serializers
from schemacms.users.backend_management import user_mgtm_backend


class ObtainJSONWebToken(views.APIView):
    """
    API View that receives a GET with a authenticated user.

    Returns a JSON Web Token that can be used for authenticated requests.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            unsigned_data = signing.loads(request.data["token"])
        except signing.BadSignature:
            raise serializers.ValidationError(code="invalidToken")
        serializer = auth_serializers.ObtainJSONWebTokenSerializer(
            data=unsigned_data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        auth_method = unsigned_data.get("auth_method")
        user = serializer.validated_data["uid"]
        resp = response.Response(
            {"token": user.get_jwt_token(auth_method=auth_method), "auth_method": auth_method}
        )
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])  # make other exchange tokens invalid
        return resp


class Logout(views.APIView):
    """
    API View that redirect to auth0 logout page
    """

    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        return shortcuts.redirect(user_mgtm_backend.get_logout_url())


obtain_jwt_token = ObtainJSONWebToken.as_view()
logout = Logout.as_view()
