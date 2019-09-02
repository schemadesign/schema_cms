import collections
import operator

import django.core.files
import django.core.files.base
from rest_framework import exceptions
from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.users import constants as user_constants
from schemacms.projects import constants as projects_constants
from schemacms.projects import serializers as projects_serializers
from schemacms.projects import models as projects_models


pytestmark = [pytest.mark.django_db]


class TestListCreateProjectView:
    """
    Tests /api/v1/projects/ create operation
    """

    example_project = {"title": "test-title", "description": "test description", "editors": []}

    def test_list_projects_for_authenticate_users(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url())

        queryset = projects_models.Project.objects.all()
        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == projects_serializers.ProjectSerializer(queryset, many=True).data

    def test_404_on_list_projects_for_non_authenticate_user(self, api_client):

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_as_admin(self, api_client, user):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)

        response = api_client.post(self.get_url(), data=self.example_project)
        project_id = response.data["id"]
        project = projects_models.Project.objects.get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    @pytest.mark.parametrize("role", [user_constants.UserRole.EDITOR, user_constants.UserRole.UNDEFINED])
    def test_create_as_editor(self, api_client, user_factory, role):
        user = user_factory(role=role)
        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(), data=self.example_project)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_editor_can_list_only_assign_projects(self, api_client, user_factory, project_factory):
        user1, user2 = user_factory.create_batch(2, editor=True)
        user1_projects = project_factory.create_batch(2, editors=[user1])

        api_client.force_authenticate(user1)
        user1_response = api_client.get(self.get_url())
        assert user1_response.status_code == status.HTTP_200_OK
        assert user1_response.data["count"] == 2
        assert (
            user1_response.data["results"]
            == projects_serializers.ProjectSerializer(user1_projects, many=True).data
        )

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
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_update_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        new_title = {"title": "new title"}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_delete_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=project.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Project.objects.filter(pk=project.pk).exists()

    def test_adding_editor(self, api_client, user_factory, user, project):
        editor1, editor2 = user_factory.create_batch(2, editor=True)
        api_client.force_authenticate(user)

        new_title = {"editors": [editor1.id, editor2.id]}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data
        assert len(response.data["editors"]) == 2

    def test_url(self, project):
        assert f"/api/v1/projects/{project.pk}" == self.get_url(pk=project.pk)

    @staticmethod
    def get_url(pk):
        return reverse("project-detail", kwargs=dict(pk=pk))


class TestListDataSourceView:
    def test_list_for_authenticate_admin_user(self, api_client, admin, project, data_source_factory):
        data_sources = data_source_factory.create_batch(2, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data["results"]
            == projects_serializers.DataSourceSerializer(self.sort_data_sources(data_sources), many=True).data
        )

    def test_404_on_list_projects_for_non_authenticate_user(self, api_client, project):
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_editor_can_list_only_assign_projects_data_sources(
        self, api_client, user_factory, project_factory, data_source_factory
    ):
        user1, user2 = user_factory.create_batch(2, editor=True)
        user1_project = project_factory(editors=[user1])
        data_sources = data_source_factory.create_batch(2, project=user1_project)

        api_client.force_authenticate(user1)
        user1_response = api_client.get(self.get_url(user1_project.id))

        assert user1_response.status_code == status.HTTP_200_OK
        assert user1_response.data["count"] == len(data_sources)
        assert (
            user1_response.data["results"]
            == projects_serializers.DataSourceSerializer(self.sort_data_sources(data_sources), many=True).data
        )

    def test_editor_cannot_access_to_not_assigned_projects_data_sources(
        self, api_client, user_factory, project_factory, data_source_factory
    ):
        user = user_factory(editor=True)
        user_project = project_factory(editors=[])
        data_source_factory.create_batch(2, project=user_project)

        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(user_project.id))

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_project_id(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(0))

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {
            "detail": exceptions.ErrorDetail(string="The project does not exist", code="not_found")
        }

    def test_url(self, project):
        assert f"/api/v1/projects/{project.id}/datasources" == self.get_url(project.id)

    @staticmethod
    def get_url(project_pk):
        return reverse("datasource-list", kwargs=dict(project_pk=project_pk))

    @staticmethod
    def sort_data_sources(data_sources):
        return sorted(data_sources, key=operator.attrgetter("created"), reverse=True)


class TestCreateDraftDataSourceView:
    def test_empty_payload(self, api_client, admin, project):
        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), dict(), format='multipart')

        assert response.status_code == status.HTTP_201_CREATED

    def test_upload_file(self, api_client, admin, project, faker):
        payload = dict(file=django.core.files.base.ContentFile(faker.csv_data(), name='test.csv'))

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), payload, format='multipart')

        assert response.status_code == status.HTTP_201_CREATED
        expected_file_path = f"projects/{project.id}/datasources/{response.data['id']}/test.csv"
        assert response.data['file'] == f"http://localhost:8000/app/schemacms/test-media/storage/{expected_file_path}"

    @staticmethod
    def get_url(project_pk):
        return reverse("datasource-list", kwargs=dict(project_pk=project_pk))
