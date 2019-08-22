from django.urls import reverse
from rest_framework import status

import pytest

from ..serializers import ProjectSerializer
from ..models import Projects


pytestmark = [pytest.mark.django_db]


class TestProjectCreateView:
    """
    Tests /api/v1/projects/ create operation
    """
    example_project = {
        "title": "test-title",
        "description": "test description"
    }

    def test_response_as_admin(self, api_client, user):
        user.is_staff = True
        api_client.force_authenticate(user)

        response = api_client.post(self.example_project)
        project_id = response.data['id']
        project = Projects.objects.get(pk=project_id)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == ProjectSerializer(instance=project).data

    def test_response_as_user(self,api_client, user):
        user.is_staff = False
        api_client.force_authenticate(user)
        response = api_client.post(self.example_project)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_url(self):
        assert "api/v1/projects" == self.get_url()

    @staticmethod
    def get_url():
        return reverse("projects")
