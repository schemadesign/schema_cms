import operator

from django import urls
import pytest
from rest_framework import status

from schemacms.authorization import constants as auth_constants
from schemacms.users import constants as user_constants, serializers as user_serializers

pytestmark = [pytest.mark.django_db]


class TestUserListView:
    """
    Tests /api/v1/users list operations.
    """

    def test_response(self, api_client, user_factory):
        user = user_factory()
        expected_users = user_factory.create_batch(2)
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == len(expected_users)
        assert {r["id"] for r in response.data["results"]} == {str(user.id) for user in expected_users}

    def test_response_ordering(self, api_client, user_factory):
        user = user_factory()
        expected_users = sorted(
            user_factory.create_batch(2), key=operator.attrgetter("first_name", "last_name")
        )
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_200_OK
        assert [r["id"] for r in response.data["results"]] == [str(user.id) for user in expected_users]

    def test_hide_users(self, api_client, user_factory):
        user = user_factory()
        for user_factory_kwargs in [
            dict(is_active=False),
            dict(is_staff=True),
            dict(role=user_constants.UserRole.UNDEFINED),
        ]:
            user_factory(**user_factory_kwargs)
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert response.data["results"] == []

    @pytest.mark.parametrize("role", [user_constants.UserRole.ADMIN, user_constants.UserRole.EDITOR])
    def test_filter_by_role(self, api_client, user_factory, role):
        user = user_factory()
        user_mapping = {
            user_constants.UserRole.ADMIN: [user_factory(admin=True)],
            user_constants.UserRole.EDITOR: [user_factory(editor=True)],
        }
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url(), dict(role=role))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert {r["id"] for r in response.data["results"]} == {str(u.id) for u in user_mapping[role]}

    def test_unauthorized(self, api_client):
        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_num_queries(self, api_client, django_assert_num_queries, faker, admin, user_factory):
        user = user_factory()
        user_factory.create_batch(3)
        api_client.force_authenticate(user)

        # +1 count
        # +1 user's query
        with django_assert_num_queries(2):
            response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_200_OK

    def test_url(self):
        assert "/api/v1/users" == self.get_url()

    def get_url(self):
        return urls.reverse("user-list")


class TestUserCreateView:
    """
    Tests /api/v1/users create operations.
    """

    @pytest.mark.parametrize(
        "payload_factory",
        [
            lambda faker: dict(email=faker.email()),
            lambda faker: dict(
                email=faker.email(), first_name=faker.first_name(), last_name=faker.last_name()
            ),
            lambda faker: dict(
                email=faker.email(),
                first_name=faker.first_name(),
                last_name=faker.last_name(),
                role=user_constants.UserRole.EDITOR,
            ),
            lambda faker: dict(
                email=faker.email(),
                first_name=faker.first_name(),
                last_name=faker.last_name(),
                role=user_constants.UserRole.ADMIN,
            ),
        ],
    )
    def test_create_by_admin(self, api_client, faker, user_factory, payload_factory):
        user = user_factory(admin=True)
        payload = payload_factory(faker=faker)
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), payload)

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_admin_assign_external_account(self, api_client, faker, mocker, user_factory):
        user = user_factory(admin=True)
        payload = dict(email=faker.email())
        assign_external_account_mock = mocker.patch("schemacms.users.models.User.assign_external_account")
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert assign_external_account_mock.called

    @pytest.mark.usefixtures("transaction_on_commit")
    def test_create_by_admin_send_invitation_email(self, api_client, faker, mocker, user_factory):
        user = user_factory(admin=True)
        payload = dict(email=faker.email())
        send_invitation_email_mock = mocker.patch("schemacms.users.models.User.send_invitation_email")
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), payload)

        assert response.status_code == status.HTTP_201_CREATED
        assert send_invitation_email_mock.called

    def test_create_by_admin_username_duplicated(self, api_client, faker, user_factory):
        user = user_factory(username='')
        payload = dict(email=faker.email())
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), payload)

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_editor(self, api_client, faker, user_factory):
        user = user_factory(editor=True)
        payload = dict(email=faker.email())
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), payload)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_url(self):
        assert "/api/v1/users" == self.get_url()

    def get_url(self):
        return urls.reverse("user-list")


class TestUserDetailView:
    """
    Tests /api/v1/users/<pk> detail operations.
    """

    def test_response(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(user.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == user_serializers.UserSerializer(instance=user).data

    def test_retrieve(self, api_client, user_factory):
        user = user_factory()
        other_user = user_factory(is_active=True)
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url(other_user.pk))

        assert response.status_code == status.HTTP_200_OK

    def test_retrieve_not_active_user(self, api_client, user_factory):
        user = user_factory()
        other_user = user_factory(is_active=False)
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url(other_user.pk))

        assert response.status_code == status.HTTP_404_NOT_FOUND

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

    def test_update_editor_role_to_admin_by_admin(self, api_client, faker, user_factory):
        user = user_factory(admin=True)
        other_user = user_factory(editor=True)
        payload = {"role": user_constants.UserRole.ADMIN}
        api_client.force_authenticate(user)

        response = api_client.patch(self.get_url(other_user.pk), payload)
        assert response.status_code == status.HTTP_200_OK
        other_user.refresh_from_db()
        assert other_user.role == user_constants.UserRole.ADMIN

    def test_downgrade_admin_role_to_editor_by_admin(self, api_client, faker, user_factory):
        user = user_factory(admin=True)
        other_user = user_factory(admin=True)
        payload = {"role": user_constants.UserRole.EDITOR}
        api_client.force_authenticate(user)

        response = api_client.patch(self.get_url(other_user.pk), payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        other_user.refresh_from_db()
        assert other_user.role == user_constants.UserRole.ADMIN

    def test_unauthorized(self, api_client, user_factory):
        other_user = user_factory()
        response = api_client.get(self.get_url(other_user.pk))

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self, user):
        assert "/api/v1/users/{}".format(user.pk) == self.get_url(pk=user.pk)

    def get_url(self, pk):
        return urls.reverse("user-detail", kwargs=dict(pk=pk))


class TestDeactivateUser:
    """
    Tests /api/v1/users/<pk>/deactivate operation.
    """

    def test_by_admin(self, mocker, api_client, user_factory):
        deactivate_mock = mocker.patch("schemacms.users.models.User.deactivate")
        user = user_factory(admin=True)
        other_user = user_factory()
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(other_user.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        deactivate_mock.assert_called_with(requester=user)

    def test_by_editor(self, mocker, api_client, user_factory):
        deactivate_mock = mocker.patch("schemacms.users.models.User.deactivate")
        user = user_factory(editor=True)
        other_user = user_factory()
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(other_user.pk))

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert not deactivate_mock.called

    def test_url(self, user):
        assert "/api/v1/users/{}/deactivate".format(user.pk) == self.get_url(pk=user.pk)

    def get_url(self, pk):
        return urls.reverse("user-deactivate", kwargs=dict(pk=pk))


class TestMeView:
    """
    Tests /api/v1/users/me operations.
    """

    def test_response(self, api_client, user):
        api_client.force_authenticate(user)

        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == user_serializers.UserSerializer(instance=user).data

    @pytest.mark.parametrize("http_method", ["put", "patch"])
    def test_update_details(self, api_client, faker, user, http_method):
        api_client.force_authenticate(user)
        payload = {"first_name": faker.first_name(), "last_name": faker.last_name(), "email": faker.email()}

        response = getattr(api_client, http_method)(self._url, payload)

        user.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == user_serializers.UserSerializer(instance=user).data

    def test_unauthorized(self, api_client):
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.parametrize(
        "jwt_extra_data",
        [
            dict(),
            dict(auth_method=auth_constants.JWTAuthMethod.EMAIL),
            dict(auth_method=auth_constants.JWTAuthMethod.GMAIL),
        ],
    )
    def test_authorize(self, api_client, user, jwt_extra_data):
        token = user.get_jwt_token(**jwt_extra_data)

        api_client.credentials(HTTP_AUTHORIZATION="JWT {}".format(token))
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_200_OK

    def test_user_not_active(self, api_client, user_factory):
        user = user_factory(is_active=False)
        token = user.get_jwt_token()
        api_client.credentials(HTTP_AUTHORIZATION="JWT {}".format(token))

        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert "/api/v1/users/me" == self._url

    @property
    def _url(self):
        return urls.reverse("me-detail")


class TestMeResetPasswordView:
    """
        Tests /api/v1/users/me/reset-password operations.
        """

    @pytest.mark.parametrize("jwt_extra_data", [dict(), dict(auth_method=auth_constants.JWTAuthMethod.EMAIL)])
    def test_response(self, api_client, user, mocker, faker, jwt_extra_data):
        token = user.get_jwt_token(**jwt_extra_data)
        redirect_url = faker.url()
        mocker.patch(
            "schemacms.users.backend_management.user_mgtm_backend.password_change_url",
            return_value=redirect_url,
        )

        response = api_client.get(self._url, HTTP_AUTHORIZATION="JWT {}".format(token))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"ticket": redirect_url}

    def test_gmail_user(self, api_client, user, faker):
        token = user.get_jwt_token(auth_method=auth_constants.JWTAuthMethod.GMAIL)

        response = api_client.get(self._url, HTTP_AUTHORIZATION="JWT {}".format(token))

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data[0]["code"] == 'invalidAuthMethod'

    def test_unauthorized(self, api_client):
        response = api_client.get(self._url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert "/api/v1/users/me/reset-password" == self._url

    @property
    def _url(self):
        return urls.reverse("me-reset-password")
