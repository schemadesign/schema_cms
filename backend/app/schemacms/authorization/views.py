from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class ObtainJSONWebToken(APIView):
    """
    API View that receives a GET with a authenticated user.

    Returns a JSON Web Token that can be used for authenticated requests.
    """

    def get(self, request, *args, **kwargs):
        user = request.user
        token = jwt_payload_handler(user)
        return Response({
            "token": jwt_encode_handler(token)
        })


obtain_jwt_token = ObtainJSONWebToken.as_view()
