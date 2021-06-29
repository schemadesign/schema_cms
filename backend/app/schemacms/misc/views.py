from django.conf import settings
from rest_framework import response, status, views


mgtm_backends = {
    "schemacms.users.backend_management.okta.OktaUserManagement": "okta-oauth2",
    "schemacms.users.backend_management.auth0.Auth0UserManagement": "auth0",
}


class HomeView(views.APIView):
    permission_classes = []

    def get(self, request):
        return response.Response(status=status.HTTP_200_OK)


class ConfigView(views.APIView):
    permission_classes = []

    def get(self, request):
        response_data = {"authentication_backend": mgtm_backends[settings.USER_MGMT_BACKEND]}
        print("test")
        return response.Response(response_data, status=status.HTTP_200_OK)
