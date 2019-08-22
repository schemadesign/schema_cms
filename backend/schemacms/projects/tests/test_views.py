from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.projects import (
    serializers as project_serializers,
    models as project_models
)


pytestmark = [pytest.mark.django_db]


class TestProjectView:
    """
    Tests /api/v1/projects/ create operation
    """
    example_project = {
        "title": "test-title",
        "description": "test description"
    }

    def test_create_as_admin(self, api_client, user):
        user.role = None
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), data=self.example_project)
        project_id = response.data['id']
        project = project_models.Projects.objects.get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == project_serializers.ProjectSerializer(instance=project).data

    def test_create_as_editor(self, api_client, user):
        user.role = None
        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(), data=self.example_project)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_projects(self):
        pass


    def test_url(self):
        assert "/api/v1/projects" == self.get_url()

    @staticmethod
    def get_url():
        return reverse("projects-list")
