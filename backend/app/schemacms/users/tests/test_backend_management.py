from urllib import parse

import auth0.v3
import django.urls
import pytest

from schemacms.users import constants
from schemacms.users.backend_management import auth0 as auth0_, base

pytestmark = [pytest.mark.django_db]


class TestBaseUserManagement:
    @pytest.mark.parametrize(
        "method_name, method_kwargs",
        [
            ("create_user", dict(user=None)),
            ("password_change_url", dict(user=None)),
            ("get_user_source", dict()),
            ("get_login_url", dict()),
            ("get_logout_url", dict()),
        ],
    )
    def test_interface(self, method_name, method_kwargs):
        mgmt = base.BaseUserManagement()
        method = getattr(mgmt, method_name)

        with pytest.raises(NotImplementedError):
            method(**method_kwargs)


class TestAuth0UserManagement:
    def test_create_user_with_name(self, mocker, user_factory, auth0_management):
        user = user_factory(first_name="Firstname", last_name="Lastname")
        mgmt = auth0_.Auth0UserManagement()

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
                "family_name": user.last_name,
            }
        )

    def test_create_user_without_name(self, mocker, user_factory, auth0_management):
        user = user_factory(first_name="", last_name="")
        mgmt = auth0_.Auth0UserManagement()

        mgmt.create_user(user)

        mgmt.proxy.users.create.assert_called_with(
            {
                "user_id": str(user.id),
                "email": user.email,
                "password": mocker.ANY,
                "connection": mgmt.connection,
                "email_verified": False,
                "verify_email": False,
                "given_name": "-",
                "family_name": "-",
            }
        )

    def test_get_user_source(self):
        assert auth0_.Auth0UserManagement().get_user_source() == constants.UserSource.AUTH0

    def test_password_change_url(self, user, auth0_management):
        mgmt = auth0_.Auth0UserManagement()
        mgmt.proxy.tickets.create_pswd_change.side_effect = auth0.v3.Auth0Error(
            status_code=400,
            error_code="operation_not_supported",
            message="The user's main connection does not support this operation",
        )

        ret = mgmt.password_change_url(user)

        assert ret == mgmt.get_login_url()

    def test_get_login_url(self, settings):
        mgmt = auth0_.Auth0UserManagement()
        path = django.urls.reverse("social:begin", kwargs={"backend": "auth0"})

        url = mgmt.get_login_url()

        assert url == f"{settings.DEFAULT_HOST}{path}"

    def test_get_logout_url(self, mocker, settings):
        mgmt = auth0_.Auth0UserManagement()
        get_login_url_mock = mocker.patch.object(mgmt, "get_login_url", return_value="http://localhost/login")

        params = {'returnTo': get_login_url_mock.return_value, 'client_id': settings.SOCIAL_AUTH_AUTH0_KEY}
        assert f'https://{settings.SOCIAL_AUTH_AUTH0_DOMAIN}/v2/logout?' + parse.urlencode(params)

    @pytest.fixture(autouse=True)
    def setup(self, settings):
        settings.USER_MGMT_AUTH0_DOMAIN = "example.com"
