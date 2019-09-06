from django import urls
import pytest
from rest_framework import status

from schemacms.users import constants as user_constants, serializers as user_serializers

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

    def test_update_user_details_by_admin(self, api_client, faker, user_factory, user_with_role):
        user = user_factory(admin=True)
        other_user = user_with_role
        payload = {"first_name": faker.first_name()}
        api_client.force_authenticate(user)

        response = api_client.patch(self.get_url(other_user.pk), payload)

        assert response.status_code == status.HTTP_200_OK
        other_user.refresh_from_db()
        assert other_user.first_name == payload["first_name"]

    def test_update_user_details_by_editor(self, api_client, faker, user_factory, user_with_role):
        user = user_factory(editor=True)
        other_user = user_with_role
        payload = {"first_name": faker.first_name()}
        api_client.force_authenticate(user)

        response = api_client.patch(self.get_url(other_user.pk), payload)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @pytest.mark.parametrize(
        "old_role, new_role",
        [
            (user_constants.UserRole.ADMIN, user_constants.UserRole.EDITOR),
            (user_constants.UserRole.EDITOR, user_constants.UserRole.ADMIN),
        ],
    )
    def test_update_user_role_by_admin(self, api_client, faker, user_factory, old_role, new_role):
        user = user_factory(admin=True)
        other_user = user_factory(role=old_role)
        payload = {"role": new_role}
        api_client.force_authenticate(user)

        response = api_client.patch(self.get_url(other_user.pk), payload)

        assert response.status_code == status.HTTP_200_OK
        other_user.refresh_from_db()
        assert other_user.role == new_role

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

    @pytest.mark.parametrize('http_method', ['put', 'patch'])
    def test_update_details(self, api_client, faker, user, http_method):
        api_client.force_authenticate(user)
        payload = {
            "first_name": faker.first_name(),
            "last_name": faker.last_name(),
            "email": faker.email(),
        }

        response = getattr(api_client, http_method)(self._url, payload)

        user.refresh_from_db()
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
        return urls.reverse("me-detail")


class TestMeResetPasswordView:
    """
        Tests /api/v1/users/me/reset-password operations.
        """

    def test_response(self, api_client, user, mocker, faker):
        redirect_url = faker.url()
        mocker.patch(
            "schemacms.users.backend_management.user_mgtm_backend.password_change_url",
            return_value=redirect_url,
        )
        api_client.force_authenticate(user)
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"ticket": redirect_url}

    def test_unauthorized(self, api_client):
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert "/api/v1/users/me/reset-password" == self._url

    @property
    def _url(self):
        return urls.reverse("me-reset-password")
