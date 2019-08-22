import pytest

from schemacms.users.backend_management import auth0

pytestmark = [pytest.mark.django_db]


class TestAuth0UserManagement:
    def create_user(self, auth0_management):
        mgmt = auth0.Auth0UserManagement()
        breakpoint()

    def test_get_user_source(self):
        pass
