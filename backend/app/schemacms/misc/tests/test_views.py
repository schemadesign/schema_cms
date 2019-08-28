from rest_framework import status

from django import urls


class TestHealthView:
    def test_response(self, api_client):
        response = api_client.get(urls.reverse('home'))

        assert response.status_code == status.HTTP_200_OK

    def test_url(self):
        assert '/' == urls.reverse('home')
