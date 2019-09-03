import pytest

from schemacms.users import constants
from schemacms.users.backend_management import auth0

pytestmark = [pytest.mark.django_db]


class TestAuth0UserManagement:
    def test_create_user_with_name(self, mocker, user_factory, auth0_management):
        user = user_factory(first_name="Firstname", last_name="Lastname")
        mgmt = auth0.Auth0UserManagement()

        mgmt.create_user(user)

        mgmt.proxy.users.create.assert_called_with(
            {
                "user_id": str(user.id),
                "email": user.email,
                "password": mocker.ANY,
                "connection": mgmt.connection,
                "email_verified": False,
                "verify_email": False,
                "given_name": user.first_name,
                "family_name": user.first_name,
            }
        )

    def test_create_user_without_name(self, mocker, user_factory, auth0_management):
        user = user_factory(first_name="", last_name="")
        mgmt = auth0.Auth0UserManagement()

        mgmt.create_user(user)

        mgmt.proxy.users.create.assert_called_with(
            {
                "user_id": str(user.id),
                "email": user.email,
                "password": mocker.ANY,
                "connection": mgmt.connection,
                "email_verified": False,
                "verify_email": False,
            }
        )

    def test_get_user_source(self):
        assert auth0.Auth0UserManagement().get_user_source() == constants.UserSource.AUTH0

    @pytest.fixture(autouse=True)
    def setup(self, settings):
        settings.USER_MGMT_AUTH0_DOMAIN = "example.com"
