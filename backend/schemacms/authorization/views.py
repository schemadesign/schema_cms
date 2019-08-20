from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from . import serializers

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class ObtainJSONWebToken(APIView):
    """
    API View that receives a GET with a authenticated user.

    Returns a JSON Web Token that can be used for authenticated requests.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = serializers.ObtainJSONWebTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['uid']
        token = jwt_payload_handler(serializer.validated_data['uid'])
        response = Response({
            "token": jwt_encode_handler(token)
        })
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])  # make other exchange tokens invalid
        return response


obtain_jwt_token = ObtainJSONWebToken.as_view()
