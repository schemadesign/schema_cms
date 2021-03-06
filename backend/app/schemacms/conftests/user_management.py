import uuid

import pytest


@pytest.fixture(autouse=True)
def auth0_auth_token(mocker):
    token_mock = mocker.patch("auth0.v3.authentication.GetToken")
    token_mock.return_value.client_credentials.return_value = {"access_token": "fakeAuth0Token"}


@pytest.fixture(autouse=True)
def auth0_management(mocker):
    auth0_mock = mocker.patch("auth0.v3.management.Auth0")
    auth0_mock.return_value.users.create.return_value = dict(user_id=uuid.uuid4().hex)
    yield auth0_mock
