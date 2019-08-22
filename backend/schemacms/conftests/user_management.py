import pytest


@pytest.fixture()
def auth0_management(mocker):
    return mocker.path('auth0.v3.management.Auth0', autospec=True)
