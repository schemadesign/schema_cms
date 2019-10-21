import uuid

from rest_framework import exceptions
from django import urls
from rest_framework import status
import pytest

from schemacms.utils import error


class TestRetrieveAuthToken:
    """
    Tests /api/v1/auth/token operations.
    """

    pytestmark = [pytest.mark.django_db]
    invalid_token_error = error.Error(message="Invalid Token", code="invalid").data

    def test_get_token(self, api_client, user):
        url = urls.reverse("authorization:token")

        response = api_client.post(url, {"uid": user.id, "token": user.get_exchange_token()})

        assert response.status_code == status.HTTP_200_OK
        assert "token" in response.data

    @pytest.mark.parametrize(
        "token, expected_errors",
        [
            ("", [error.Error(message="This field may not be blank.", code="blank").data]),
            (None, [invalid_token_error]),
            ("12345", [invalid_token_error]),
        ],
    )
    def test_invalid_token(self, api_client, user, token, expected_errors):
        url = urls.reverse("authorization:token")

        response = api_client.post(url, {"uid": user.id, "token": token})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "token" in response.data
        assert response.data["token"] == expected_errors

    def test_user_does_not_exist(self, api_client):
        url = urls.reverse("authorization:token")
        uid = uuid.uuid4().hex

        response = api_client.post(url, {"uid": uid, "token": "1234"})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "uid" in response.data
        assert response.data["uid"] == [
            error.Error(
                message='Invalid pk "{uid}" - object does not exist.'.format(uid=uid), code="does_not_exist"
            ).data
        ]

    def test_reuse_token(self, api_client, user):
        url = urls.reverse("authorization:token")

        response1 = api_client.post(url, {"uid": user.id, "token": user.get_exchange_token()})
        response2 = api_client.post(url, {"uid": user.id, "token": user.get_exchange_token()})

        assert response1.status_code == status.HTTP_200_OK
        assert response2.status_code == status.HTTP_400_BAD_REQUEST
        assert "token" in response2.data
        assert response2.data["token"] == [self.invalid_token_error]

    def test_url(self):
        assert "/api/v1/auth/token" == urls.reverse("authorization:token")


class TestLogout:
    def test_response(self, api_client, mocker):
        get_logout_url_mock = mocker.patch(
            "schemacms.users.backend_management.user_mgtm_backend.get_logout_url",
            return_value="http://auth0.localhost/logout",
        )
        url = urls.reverse("authorization:logout")

        response = api_client.get(url)

        assert response.status_code == status.HTTP_302_FOUND
        assert response['Location'] == get_logout_url_mock.return_value

    def test_url(self):
        assert "/api/v1/auth/logout" == urls.reverse("authorization:logout")
