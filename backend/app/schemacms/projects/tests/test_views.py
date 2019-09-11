import json
import operator
import os

from django.conf import settings
from rest_framework import exceptions
from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.users import constants as user_constants
from schemacms.projects import (
    constants as projects_constants,
    serializers as projects_serializers,
    models as projects_models,
)


pytestmark = [pytest.mark.django_db]


class TestListCreateProjectView:
    """
    Tests /api/v1/projects/ create operation
    """

    example_project = {"title": "test-title", "description": "test description", "editors": []}

    def test_list_projects_for_authenticate_users(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url())

        queryset = projects_models.Project.objects.all().order_by("-created")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == projects_serializers.ProjectSerializer(queryset, many=True).data

    def test_404_on_list_projects_for_non_authenticate_user(self, api_client):

        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_editor_can_list_only_assign_projects(self, api_client, user_factory, project_factory):
        user1, user2 = user_factory.create_batch(2, editor=True)
        user1_projects = project_factory.create_batch(2, editors=[user1])

        api_client.force_authenticate(user1)
        user1_response = api_client.get(self.get_url())
        assert user1_response.status_code == status.HTTP_200_OK
        assert user1_response.data["count"] == 2
        assert (
            user1_response.data["results"]
            == projects_serializers.ProjectSerializer(self.__sort_projects(user1_projects), many=True).data
        )

    def test_create_as_admin(self, api_client, user):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)

        self.example_project["editors"].append(user.id)

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

    def test_create_without_editors(self, api_client, user):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)

        self.example_project.pop("editors")

        response = api_client.post(self.get_url(), data=self.example_project)

        project_id = response.data["id"]
        project = projects_models.Project.objects.get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    @pytest.mark.slow
    def test_num_queries(
        self, api_client, django_assert_num_queries, faker, admin, project_factory, data_source_factory
    ):
        projects = project_factory.create_batch(3)
        for project in projects:
            data_source_factory.create_batch(2, project=project)
        api_client.force_authenticate(admin)

        # Number of queries:
        # +1 count query for pagination
        # +1 projects query
        # +1 prefetch editors
        with django_assert_num_queries(3):
            response = api_client.get(self.get_url())
        assert response.status_code == status.HTTP_200_OK

    def test_url(self):
        assert "/api/v1/projects" == self.get_url()

    @staticmethod
    def get_url():
        return reverse("project-list")

    @staticmethod
    def __sort_projects(iterable):
        return sorted(iterable, key=operator.attrgetter("created"), reverse=True)


class TestRetrieveUpdateDeleteProjectView:
    """
    Tests /api/v1/projects/<pk> detail operations
    """

    def test_retrieve(self, api_client, user, project):
        api_client.force_authenticate(user)

        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_meta_data_sources(self, api_client, faker, admin, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)
        api_client.force_authenticate(admin)

        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert "meta" in response.data
        assert response.data["meta"]["data_sources"] == {"count": expected}

    def test_update_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        new_title = {"title": "new title"}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_update_project_by_not_projects_editor(self, api_client, user_factory, project):
        editor1, editor2 = user_factory.create_batch(2, editor=True)
        project.editors.add(editor2)
        payload = {"title": "new title"}

        api_client.force_authenticate(editor1)
        response = api_client.patch(self.get_url(pk=project.pk), data=payload)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_403_FORBIDDEN

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
    def test_list_for_authenticate_admin_user(self, api_client, rf, admin, project, data_source_factory):
        data_sources = data_source_factory.create_batch(2, project=project)

        request = rf.get(self.get_url(project.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data["results"]
            == projects_serializers.DataSourceSerializer(
                self.sort_data_sources(data_sources), many=True, context={"request": request}
            ).data
        )

    def test_404_on_list_projects_for_non_authenticate_user(self, api_client, project):
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_editor_can_list_only_assign_projects_data_sources(
        self, api_client, rf, user_factory, project_factory, data_source_factory
    ):
        user1, user2 = user_factory.create_batch(2, editor=True)
        user1_project = project_factory(editors=[user1])
        data_sources = data_source_factory.create_batch(2, project=user1_project)

        request = rf.get(self.get_url(user1_project.id))
        api_client.force_authenticate(user1)
        user1_response = api_client.get(self.get_url(user1_project.id))

        assert user1_response.status_code == status.HTTP_200_OK
        assert user1_response.data["count"] == len(data_sources)
        assert (
            user1_response.data["results"]
            == projects_serializers.DataSourceSerializer(
                self.sort_data_sources(data_sources), many=True, context={"request": request}
            ).data
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

        response = api_client.post(self.get_url(project.id), dict(), format="multipart")

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_editor_assigned_to_project(self, api_client, editor, project):
        project.editors.add(editor)
        api_client.force_authenticate(editor)

        response = api_client.post(self.get_url(project.id), dict(), format="multipart")

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_editor_not_assigned_to_project(self, api_client, editor, project):
        api_client.force_authenticate(editor)

        response = api_client.post(self.get_url(project.id), dict(), format="multipart")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_upload_file(self, api_client, admin, project, faker):
        payload = dict(file=faker.csv_upload_file(filename="test.csv"))

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), payload, format="multipart")
        dsource = projects_models.DataSource.objects.get(id=response.data["id"])
        correct_path = os.path.join(
            dsource.file.storage.location,
            f"{settings.STORAGE_DIR}/projects",
            f"{dsource.project_id}/datasources/{dsource.id}/test.csv",
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["file"] == f"http://testserver/{correct_path.lstrip('/')}"

    def test_request_user_as_created_by(self, api_client, admin, project):
        api_client.force_authenticate(admin)

        response = api_client.post(self.get_url(project.id), dict(), format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        assert project.data_sources.get(id=response.data["id"]).created_by == admin

    @staticmethod
    def get_url(project_pk):
        return reverse("datasource-list", kwargs=dict(project_pk=project_pk))


class TestUpdateDraftDataSourceView:
    def test_response(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory(draft=True)
        url = self.get_url(data_source_pk=data_source.pk, project_pk=data_source.project_id)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == projects_constants.DataSourceStatus.READY_FOR_PROCESSING

    def test_update_by_editor_assigned_to_project(
        self, api_client, faker, editor, project, data_source_factory
    ):
        project.editors.add(editor)
        data_source = data_source_factory(project=project, draft=True)
        url = self.get_url(data_source_pk=data_source.pk, project_pk=project.id)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(editor)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK

    def test_update_by_editor_not_assigned_to_project(self, api_client, faker, editor, data_source_factory):
        data_source = data_source_factory(draft=True)
        url = self.get_url(data_source_pk=data_source.pk, project_pk=data_source.project_id)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(editor)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_error_response(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory(draft=True)
        url = self.get_url(data_source_pk=data_source.pk, project_pk=data_source.project_id)
        payload = dict()

        api_client.force_authenticate(admin)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.keys() == {"name", "type", "file"}

    def test_url(self, data_source):
        assert f"/api/v1/projects/{data_source.project_id}/datasources/{data_source.pk}" == self.get_url(
            data_source_pk=data_source.pk, project_pk=data_source.project_id
        )

    def test_file_overwrite(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory(draft=True)
        _, file_name_before_update = data_source.get_original_file_name()
        url = self.get_url(data_source_pk=data_source.pk, project_pk=data_source.project_id)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["file_name"] == file_name_before_update

    @staticmethod
    def get_url(data_source_pk, project_pk):
        return reverse("datasource-detail", kwargs=dict(pk=data_source_pk, project_pk=project_pk))


class TestDataSourceProcess:
    def test_process_file(self, api_client, admin, project, faker):
        payload = dict(file=faker.csv_upload_file(filename="test.csv"))
        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), payload, format="multipart")
        data_source_id = response.data["id"]
        assert not response.data["meta_data"]

        api_client.post(f"{self.get_url(project.id)}/{data_source_id}/process", dict())
        response_with_meta = api_client.get(f"{self.get_url(project.id)}/{data_source_id}")

        assert response_with_meta.data["meta_data"]["items"] == 1
        assert response_with_meta.data["meta_data"]["fields"] == 3

    @staticmethod
    def get_url(project_pk):
        return reverse("datasource-list", kwargs=dict(project_pk=project_pk))


class TestDataSourcePreview:
    def test_response(self, api_client, admin, data_source):
        api_client.force_authenticate(admin)
        expected_data = json.loads(data_source.meta_data.preview.read())
        expected_data["data_source"] = {"name": data_source.name}

        response = api_client.get(self.get_url(data_source.project_id, data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    @staticmethod
    def get_url(project_pk, data_source_pk):
        return reverse("datasource-preview", kwargs=dict(pk=data_source_pk, project_pk=project_pk))
