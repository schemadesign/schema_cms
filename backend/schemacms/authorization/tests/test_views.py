from django import urls
from rest_framework import status
import pytest


class TestRetrieveAuthToken:
    """
    Tests /api/v1/auth/token operations.
    """

    pytestmark = [pytest.mark.django_db]

    def test_get_token(self, api_client, user):
        url = urls.reverse('authorization:token')

        api_client.force_authenticate(user)
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data

    def test_unauthenticated(self, api_client):
        url = urls.reverse('authorization:token')

        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert '/api/v1/auth/token' == urls.reverse('authorization:token')
