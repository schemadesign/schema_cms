import operator

import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.datasources import serializers as ds_serializers, constants as ds_constants
from schemacms.projects import (
    serializers as projects_serializers,
    models as projects_models,
)
from schemacms.users import constants as user_constants
from schemacms.utils import error

pytestmark = [pytest.mark.django_db]


def multisort(xs, specs):
    for key, reverse_ in reversed(specs):
        xs.sort(key=operator.attrgetter(key), reverse=reverse_)
    return xs


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

    def test_create_as_admin(self, api_client, user, mocker):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)

        create_xml_file_mock = mocker.patch("schemacms.projects.models.Project.create_xml_file")

        self.example_project["editors"].append(user.id)
        response = api_client.post(self.get_url(), data=self.example_project)
        project_id = response.data["id"]
        project = projects_models.Project.objects.all().get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data
        create_xml_file_mock.assert_called_once()

    @pytest.mark.parametrize("role", [user_constants.UserRole.EDITOR, user_constants.UserRole.UNDEFINED])
    def test_create_as_editor(self, api_client, user_factory, role, mocker):
        user = user_factory(role=role)
        api_client.force_authenticate(user)
        create_xml_file_mock = mocker.patch("schemacms.projects.models.Project.create_xml_file")

        response = api_client.post(self.get_url(), data=self.example_project)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        create_xml_file_mock.assert_not_called()

    def test_create_without_editors(self, api_client, user, mocker):
        user.role = user_constants.UserRole.ADMIN
        api_client.force_authenticate(user)
        create_xml_file_mock = mocker.patch("schemacms.projects.models.Project.create_xml_file")

        self.example_project.pop("editors")

        response = api_client.post(self.get_url(), data=self.example_project)

        project_id = response.data["id"]
        project = projects_models.Project.objects.all().get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data
        create_xml_file_mock.assert_called_once()

    def test_num_queries(
        self,
        api_client,
        django_assert_num_queries,
        faker,
        admin,
        user_factory,
        project_factory,
        data_source_factory,
    ):
        projects = [
            project_factory(editors=[user_factory(editor=True), user_factory(editor=True)]) for _ in range(3)
        ]
        for project in projects:
            data_source_factory.create_batch(2, project=project)
        api_client.force_authenticate(admin)

        # Number of queries:
        # +1 count query for pagination
        # +1 projects query
        # +1 prefetch editors
        # +1 prefetch block templates
        # +1 prefetch page templates
        with django_assert_num_queries(5):
            response = api_client.get(self.get_url())
        assert response.status_code == status.HTTP_200_OK

    def test_url(self):
        assert "/api/v1/projects" == self.get_url()

    @staticmethod
    def get_url():
        return reverse("projects:project-list")

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
        assert response.data["meta"]["data_sources"] == expected

    def test_update_project_by_owner(self, api_client, user, project, mocker):
        api_client.force_authenticate(user)
        create_xml_file_mock = mocker.patch("schemacms.projects.models.Project.create_xml_file")

        new_title = {"title": "new title"}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data
        create_xml_file_mock.assert_called_once()

    def test_update_project_name_already_occupied(self, api_client, user, project_factory, mocker):
        project = project_factory()
        other_project = project_factory()
        api_client.force_authenticate(user)

        new_title = {"title": other_project.title}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "title": [error.Error(message="This field must be unique.", code="projectTitleUnique").data]
        }

    def test_update_project_by_not_projects_editor(self, api_client, user_factory, project, mocker):
        editor1, editor2 = user_factory.create_batch(2, editor=True)
        project.editors.add(editor2)
        payload = {"title": "new title"}

        api_client.force_authenticate(editor1)
        response = api_client.patch(self.get_url(pk=project.pk), data=payload)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_project_by_owner(self, api_client, user, project, mocker):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=project.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Project.objects.all().filter(pk=project.pk).exists()
        assert projects_models.Project.objects.all_with_deleted().filter(pk=project.pk).exists()

    def test_url(self, project):
        assert f"/api/v1/projects/{project.pk}" == self.get_url(pk=project.pk)

    @staticmethod
    def get_url(pk):
        return reverse("projects:project-detail", kwargs=dict(pk=pk))


class TestProjectDataSourcesView:
    def test_list_for_authenticate_admin_user(
        self, api_client, rf, admin, project, data_source_factory, job_step_factory
    ):
        data_sources = data_source_factory.create_batch(2, project=project)
        # Set active job to test active job serialization
        for data_source in data_sources:
            step = job_step_factory(
                datasource_job__datasource=data_source,
                datasource_job__job_state=ds_constants.ProcessingState.SUCCESS,
                options={"columns": ["imageurl"]},
            )
            data_source.active_job = step.datasource_job
            data_source.save(update_fields=["active_job"])

        request = rf.get(self.get_url(project.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        for result, ds in zip(response.data["results"], self.sort_data_sources(data_sources)):
            assert result == ds_serializers.DataSourceSerializer(ds, context={"request": request}).data

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
            == ds_serializers.DataSourceSerializer(
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
        assert response.data == {"detail": error.Error(message="Not found.", code="not_found").data}

    def test_url(self, project):
        assert f"/api/v1/projects/{project.id}/datasources" == self.get_url(project.id)

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-list", kwargs=dict(project_pk=pk))

    @staticmethod
    def sort_data_sources(data_sources):
        return sorted(data_sources, key=operator.attrgetter("created"), reverse=True)


class TestRemoveEditorFromProject:
    def test_admin_can_remove_editor(self, api_client, user, user_factory, project_factory):
        user1 = user_factory(editor=True)
        user2 = user_factory(editor=True)
        project = project_factory(editors=[user1, user2])
        pyload = {"id": user1.id}

        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(project.id), pyload)
        project.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert project.editors.count() == 1

    def test_editor_cant_remove_editor(self, api_client, user, user_factory, project_factory):
        user1 = user_factory(editor=True)
        user2 = user_factory(editor=True)
        project = project_factory(editors=[user1, user2])
        pyload = {"id": user1.id}

        api_client.force_authenticate(user2)
        response = api_client.post(self.get_url(project.id), pyload)
        project.refresh_from_db()

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @staticmethod
    def get_url(pk):
        return reverse("projects:project-remove-editor", kwargs=dict(pk=pk))


class TestAddEditorToProject:
    def test_admin_can_add_editor(self, api_client, user, user_factory, project_factory):
        user1 = user_factory(editor=True)
        user2 = user_factory(editor=True)
        project = project_factory(editors=[user1])
        pyload = {"id": user2.id}

        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(project.id), pyload)
        project.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert project.editors.count() == 2

    def test_editor_cant_add_editor(self, api_client, user_factory, project_factory):
        user1 = user_factory(editor=True)
        user2 = user_factory(editor=True)
        project = project_factory(editors=[user1])
        pyload = {"id": user2.id}

        api_client.force_authenticate(user1)
        response = api_client.post(self.get_url(project.id), pyload)
        project.refresh_from_db()

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @staticmethod
    def get_url(pk):
        return reverse("projects:project-add-editor", kwargs=dict(pk=pk))


class TestProjectPagesAdditionalData:
    @staticmethod
    def get_url(pk):
        return reverse("projects:project-page-additional-data", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, project, section, tag_category_factory, page_factory):
        tag_category_factory.create_batch(4, project=project, type=dict(content=True))
        pages = page_factory.create_batch(3, project=project, section=section)

        for page in pages:
            published_version = page.copy_page(attrs={"is_draft": False})

            page.published_version = published_version
            page.save()

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["internal_connections"]) == 1
        assert len(response.data["internal_connections"][0]["pages"]) == 3
        assert len(response.data["tag_categories"]) == 4
        assert len(response.data["page_templates"]) == 0
        assert len(response.data["states"]) == 0
