from django import urls
import pytest
from rest_framework import status

from schemacms.users import serializers as user_serializers

pytestmark = [pytest.mark.django_db]


class TestUserDetailView:
    """
    Tests /api/v1/users/<pk> detail operations.
    """

    @pytest.mark.parametrize("authorize", [True, False])
    def test_response(self, api_client, user, authorize):
        if authorize:
            api_client.force_authenticate(user)
        response = api_client.get(self.get_url(user.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == user_serializers.UserSerializer(instance=user).data

    def test_url(self, user):
        assert "/api/v1/users/{}".format(user.pk) == self.get_url(pk=user.pk)

    def get_url(self, pk):
        return urls.reverse("user-detail", kwargs=dict(pk=pk))


class TestMeView:
    """
    Tests /api/v1/users/me operations.
    """

    def test_response(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == user_serializers.UserSerializer(instance=user).data

    def test_unauthorized(self, api_client):
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert "/api/v1/users/me" == self._url

    def test_authorize(self, api_client, user):
        token = user.get_jwt_token()

        api_client.credentials(HTTP_AUTHORIZATION="JWT {}".format(token))
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_200_OK

    @property
    def _url(self):
        return urls.reverse("me-list")


class TestMeResetPasswordView:
    """
        Tests /api/v1/users/me/reset-password operations.
        """

    def test_response(self, api_client, user, mocker, faker):
        redirect_url = faker.url()
        mocker.patch(
            'schemacms.users.backend_management.user_mgtm_backend.password_change_url',
            return_value=redirect_url,
        )
        api_client.force_authenticate(user)
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'ticket': redirect_url}

    def test_unauthorized(self, api_client):
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert '/api/v1/users/me/reset-password' == self._url

    @property
    def _url(self):
        return urls.reverse('me-reset-password')
