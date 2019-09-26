from django import shortcuts
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

from . import serializers
from schemacms.users.backend_management import user_mgtm_backend


class ObtainJSONWebToken(APIView):
    """
    API View that receives a GET with a authenticated user.

    Returns a JSON Web Token that can be used for authenticated requests.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = serializers.ObtainJSONWebTokenSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["uid"]
        response = Response({"token": user.get_jwt_token()})
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])  # make other exchange tokens invalid
        return response


class Logout(APIView):
    """
    API View that redirect to auth0 logout page
    """

    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        return shortcuts.redirect(user_mgtm_backend.get_logout_url())


obtain_jwt_token = ObtainJSONWebToken.as_view()
logout = Logout.as_view()
