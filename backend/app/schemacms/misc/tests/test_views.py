from rest_framework import status
from django import urls

import pytest


class TestHealthView:
    def test_response(self, api_client):
        response = api_client.get(urls.reverse("home"))

        assert response.status_code == status.HTTP_200_OK

    def test_url(self):
        assert "/" == urls.reverse("home")


class TestConfigView:
    @pytest.mark.parametrize(
        "mgtm_backend, type",
        [
            ("schemacms.users.backend_management.auth0.Auth0UserManagement", "auth0"),
            ("schemacms.users.backend_management.okta.OktaUserManagement", "okta-oauth2"),
        ],
    )
    def test_response(self, api_client, settings, mgtm_backend, type):
        settings.USER_MGMT_BACKEND = mgtm_backend
        response = api_client.get(urls.reverse("config"))

        expected_response = {"authentication_backend": type}

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_response

    def test_url(self):
        assert "/" == urls.reverse("home")
