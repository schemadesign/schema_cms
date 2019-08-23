from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.users.constants import UserRole
from schemacms.projects.serializers import ProjectSerializer
from schemacms.projects.models import Project


pytestmark = [pytest.mark.django_db]


class TestListCreateProjectView:
    """
    Tests /api/v1/projects/ create operation
    """
    example_project = {
        "title": "test-title",
        "description": "test description"
    }

    def test_list_projects_for_authenticate_users(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url())

        queryset = Project.objects.all()
        assert response.status_code == status.HTTP_200_OK
        assert response.data['results'] == ProjectSerializer(queryset, many=True).data

    def test_404_on_list_projects_for_non_authenticate_user(self, api_client):

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_as_admin(self, api_client, user):
        user.role = UserRole.ADMIN
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), data=self.example_project)
        project_id = response.data['id']
        project = Project.objects.get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == ProjectSerializer(instance=project).data

    @pytest.mark.parametrize('role', [UserRole.EDITOR, UserRole.UNDEFINED])
    def test_create_as_editor(self, api_client, user, role):
        user.role = role
        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(), data=self.example_project)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_projects(self):
        pass

    def test_url(self):
        assert "/api/v1/projects" == self.get_url()

    @staticmethod
    def get_url():
        return reverse("project-list")


class TestRetrieveUpdateDeleteProjectView:
    """
    Tests /api/v1/projects/<pk> detail operations
    """

    def test_retrieve(self, api_client, user, project):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == ProjectSerializer(instance=project).data

    def test_update_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        update_project_data = ProjectSerializer(instance=project).data
        update_project_data["title"] = "new title"

        response = api_client.patch(
            self.get_url(pk=project.pk),
            data=update_project_data,
        )

        project.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data == ProjectSerializer(instance=project).data

    def test_delete_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=project.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Project.objects.filter(pk=project.pk).exists()

    def test_url(self, project):
        assert f"/api/v1/projects/{project.pk}" == self.get_url(pk=project.pk)

    @staticmethod
    def get_url(pk):
        return reverse("project-detail", kwargs=dict(pk=pk))
