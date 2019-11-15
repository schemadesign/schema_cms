import uuid

from django import urls
from rest_framework import status
import pytest

from schemacms.authorization import pipeline
from schemacms.utils import error


class TestRetrieveAuthToken:
    """
    Tests /api/v1/auth/token operations.
    """

    url = urls.reverse("authorization:token")
    pytestmark = [pytest.mark.django_db]
    invalid_token_error = error.Error(message="Invalid Token", code="invalid").data

    def test_get_token(self, api_client, user):
        payload = {"uid": user.id, "token": pipeline.generate_signed_exchange_token(user)}

        response = api_client.post(self.url, payload)

        assert response.status_code == status.HTTP_200_OK
        assert "token" in response.data

    @pytest.mark.parametrize(
        "token, expected_errors",
        [
            ("", [error.Error(message="This field may not be blank.", code="blank").data]),
            (None, [error.Error(message="This field may not be null.", code="null").data]),
            ("12345", [invalid_token_error]),
        ],
    )
    def test_invalid_token(self, api_client, user, mocker, token, expected_errors):
        mocker.patch.object(user, "get_exchange_token", return_value=token)
        payload = {"uid": user.id, "token": pipeline.generate_signed_exchange_token(user)}

        response = api_client.post(self.url, payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "token" in response.data
        assert response.data["token"] == expected_errors

    def test_user_does_not_exist(self, api_client, user):
        payload = {"uid": user.id, "token": pipeline.generate_signed_exchange_token(user)}
        user_id = user.id
        user.delete()

        response = api_client.post(self.url, payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "uid" in response.data
        assert response.data["uid"] == [
            error.Error(
                message='Invalid pk "{uid}" - object does not exist.'.format(uid=user_id),
                code="does_not_exist",
            ).data
        ]

    def test_invalid_token_signature(self, api_client):
        url = urls.reverse("authorization:token")
        uid = uuid.uuid4().hex

        response = api_client.post(url, {"uid": uid, "token": "1234"})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == [{'code': 'invalidToken', 'message': 'Invalid input.'}]

    def test_reuse_token(self, api_client, user):
        payload = {"uid": user.id, "token": pipeline.generate_signed_exchange_token(user)}

        response1 = api_client.post(self.url, payload)
        response2 = api_client.post(self.url, payload)

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
