import json
import operator
import os
import uuid

from django.core.files import base
from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.users import constants as user_constants
from schemacms.projects import (
    constants as projects_constants,
    serializers as projects_serializers,
    models as projects_models,
)
from schemacms.utils import error


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
        project = projects_models.Project.objects.all().get(pk=project_id)

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
        project = projects_models.Project.objects.all().get(pk=project_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

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
        # +1 prefetch directories
        with django_assert_num_queries(4):
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

    def test_update_project_by_owner(self, api_client, user, project):
        api_client.force_authenticate(user)

        new_title = {"title": "new title"}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        project.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.ProjectSerializer(instance=project).data

    def test_update_project_name_already_occupied(self, api_client, user, project_factory):
        project = project_factory()
        other_project = project_factory()
        api_client.force_authenticate(user)

        new_title = {"title": other_project.title}

        response = api_client.patch(self.get_url(pk=project.pk), data=new_title)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            'title': [error.Error(message='This field must be unique.', code='projectTitleUnique').data]
        }

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
        assert not projects_models.Project.objects.all().filter(pk=project.pk).exists()
        assert projects_models.Project.objects.all_with_deleted().filter(pk=project.pk).exists()

    def test_url(self, project):
        assert f"/api/v1/projects/{project.pk}" == self.get_url(pk=project.pk)

    @staticmethod
    def get_url(pk):
        return reverse("projects:project-detail", kwargs=dict(pk=pk))


class TestProjectDataSourcesView:
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

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_invalid_project_id(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(0))

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {"detail": error.Error(message="Not found.", code="not_found").data}

    def test_url(self, project):
        assert f"/api/v1/projects/{project.id}/datasources" == self.get_url(project.id)

    @staticmethod
    def get_url(pk):
        return reverse("projects:project-datasources", kwargs=dict(pk=pk))

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


class TestCreateDataSourceView:
    @staticmethod
    def generate_payload(project, faker):
        payload = {
            "project": project.id,
            "name": faker.word(),
            "type": projects_constants.DataSourceType.FILE,
            "file": faker.csv_upload_file(),
        }
        return payload

    def test_empty_payload(self, api_client, admin, project):
        api_client.force_authenticate(admin)

        response = api_client.post(self.get_url(), dict(project=project.id), format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_by_editor_assigned_to_project(self, api_client, editor, project, faker):
        project.editors.add(editor)
        api_client.force_authenticate(editor)
        payload = self.generate_payload(project, faker)

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_editor_not_assigned_to_project(self, api_client, editor, project, faker):
        api_client.force_authenticate(editor)
        payload = self.generate_payload(project, faker)

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_request_user_as_created_by(self, api_client, admin, project, faker):
        api_client.force_authenticate(admin)
        payload = self.generate_payload(project, faker)

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED, response.content
        assert project.data_sources.get(id=response.data["id"]).created_by == admin

    @staticmethod
    def get_url():
        return reverse("projects:datasource-list")


class TestUpdateDataSourceView:
    def test_response(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.patch(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK

    def test_object_in_db(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(),
            type=projects_constants.DataSourceType.FILE,
            file=faker.csv_upload_file(filename='filename.csv'),
        )
        api_client.force_authenticate(admin)

        api_client.patch(url, payload, format="multipart")

        data_source.refresh_from_db()
        assert data_source.get_original_file_name()[1] == payload["file"].name

    def test_update_by_editor_assigned_to_project(
        self, api_client, faker, editor, project, data_source_factory
    ):
        project.editors.add(editor)
        data_source = data_source_factory(project=project)
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(editor)
        response = api_client.patch(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK

    def test_update_by_editor_not_assigned_to_project(self, api_client, faker, editor, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(editor)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_error_response(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict()

        api_client.force_authenticate(admin)
        response = api_client.put(url, payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.keys() == {"name", "type", "file", "project"}

    def test_unique_name(self, api_client, faker, admin, data_source_factory):
        other_datasource = data_source_factory(name="test")
        data_source = data_source_factory(project=other_datasource.project)
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=other_datasource.name,
            type=projects_constants.DataSourceType.FILE,
            file=faker.csv_upload_file(),
        )
        api_client.force_authenticate(admin)

        response = api_client.patch(url, payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST, response.content
        assert response.data == {
            'name': [
                error.Error(
                    message='DataSource with this name already exist in project.',
                    code='dataSourceProjectNameUnique',
                ).data
            ]
        }

    @pytest.mark.parametrize(
        "job_status",
        [projects_constants.DataSourceJobState.PENDING, projects_constants.DataSourceJobState.PROCESSING],
    )
    def test_error_file_reupload_when_job_is_processing(
        self, api_client, faker, admin, data_source_factory, job_factory, job_status
    ):
        data_source = data_source_factory()
        job_factory(datasource=data_source, job_state=job_status)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.put(self.get_url(pk=data_source.pk), payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_url(self, data_source):
        assert f"/api/v1/datasources/{data_source.pk}" == self.get_url(pk=data_source.pk)

    def test_file_overwrite(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        _, file_name_before_update = data_source.get_original_file_name()
        payload = dict(type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file())

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(pk=data_source.pk), payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["file_name"] == file_name_before_update

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-detail", kwargs=dict(pk=pk))


class TestDataSourceProcess:
    def test_process_file(self, api_client, admin, data_source_factory, faker):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        api_client.force_authenticate(admin)

        response = api_client.post(url)

        data_source_refreshed = projects_models.DataSource.objects.select_related('meta_data').get(
            pk=data_source.pk
        )
        assert response.data == data_source_refreshed.meta_data.data

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-process", kwargs=dict(pk=pk))


class TestDataSourcePreview:
    def test_response(self, api_client, admin, data_source):
        api_client.force_authenticate(admin)
        expected_data = json.loads(data_source.meta_data.preview.read())
        expected_data["data_source"] = {"name": data_source.name}

        response = api_client.get(self.get_url(data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-preview", kwargs=dict(pk=pk))


@pytest.mark.usefixtures("ds_source_file_latest_version_mock")
class TestDataSourceJobCreate:
    @pytest.mark.parametrize("description", ['', "test_desc"])
    def test_response(self, api_client, admin, data_source_factory, script_factory, description):
        data_source = data_source_factory(created_by=admin)
        script_1 = script_factory(is_predefined=True, created_by=admin, datasource=None)
        job_data = dict(steps=[{"script": script_1.id, "exec_order": 0}], description=description)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=job_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert len(data_source.jobs.all()) == 1
        assert data_source.jobs.last().steps.filter(script=script_1).exists()

    @pytest.mark.usefixtures("transaction_on_commit")
    def test_schedule_worker_with(self, api_client, admin, data_source_factory, script_factory, mocker):
        data_source = data_source_factory(created_by=admin)
        script_1 = script_factory(is_predefined=True, created_by=admin, datasource=None)
        job_data = dict(steps=[{"script": script_1.id, "exec_order": 0}])
        schedule_worker_with_mock = mocker.patch("schemacms.projects.services.schedule_worker_with")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=job_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        job = projects_models.DataSourceJob.objects.all().get(pk=response.data["id"])
        schedule_worker_with_mock.assert_called_with(job, data_source.file.size)

    def test_step_with_options(self, api_client, admin, data_source_factory, script_factory):
        data_source = data_source_factory(created_by=admin)
        script_1 = script_factory(is_predefined=True, created_by=admin, datasource=None)
        job_data = dict(steps=[{"script": script_1.id, "exec_order": 0, "options": {"columns": ["A", "B"]}}])

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=job_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        step = projects_models.DataSourceJobStep.objects.get(datasource_job_id=response.data["id"])
        assert step.options == job_data["steps"][0]["options"]

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-job", kwargs=dict(pk=pk))


@pytest.mark.usefixtures("ds_source_file_latest_version_mock")
class TestDataSourceJobUpdateState:
    @pytest.fixture()
    def lambda_auth_token(self, settings):
        settings.LAMBDA_AUTH_TOKEN = uuid.uuid4().hex
        return settings.LAMBDA_AUTH_TOKEN

    def test_job_state_from_pending_to_processing(self, api_client, job_factory, lambda_auth_token):
        job = job_factory(job_state=projects_constants.DataSourceJobState.PENDING, result=None, error="")
        payload = dict(
            job_state=projects_constants.DataSourceJobState.PROCESSING,
            result="path/to/result.csv",
            error="test",
        )

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token)
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT, response.content
        assert job.job_state == payload["job_state"]
        assert not job.result
        assert job.error == ""

    def test_job_state_from_processing_to_success(
        self, api_client, job_factory, mocker, lambda_auth_token, default_storage
    ):
        job = job_factory(job_state=projects_constants.DataSourceJobState.PROCESSING, result=None, error="")
        default_storage.save(name="path/to/result.csv", content=base.ContentFile("test,1,2".encode()))
        payload = dict(
            job_state=projects_constants.DataSourceJobState.SUCCESS, result="path/to/result.csv", error="test"
        )
        set_active_job_mock = mocker.patch("schemacms.projects.models.DataSource.set_active_job")

        response = api_client.post(
            self.get_url(job.pk),
            payload,
            HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token),
            format="json",
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT, response.content
        assert job.job_state == payload["job_state"]
        assert job.result == payload["result"]
        assert job.error == ""
        set_active_job_mock.assert_called_with(job)

    def test_job_state_from_processing_to_failed(self, api_client, job_factory, lambda_auth_token):
        job = job_factory(job_state=projects_constants.DataSourceJobState.PROCESSING, result=None)
        payload = dict(
            job_state=projects_constants.DataSourceJobState.FAILED,
            result="path/to/result.csv",
            error="Something goes wrong",
        )

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token)
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT, response.content
        assert job.job_state == payload["job_state"]
        assert job.error == payload["error"]
        assert not job.result

    @pytest.mark.parametrize(
        "job_state",
        [projects_constants.DataSourceJobState.SUCCESS, projects_constants.DataSourceJobState.FAILED],
    )
    def test_job_state_to_pending(self, api_client, job_factory, job_state, lambda_auth_token):
        job = job_factory(job_state=job_state)
        payload = dict(job_state=projects_constants.DataSourceJobState.PENDING)

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token)
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            'job_state': [{'code': 'invalid_choice', 'message': '"pending" is not a valid choice.'}]
        }

    @pytest.mark.parametrize(
        "initial_job_state, new_job_state",
        [
            (projects_constants.DataSourceJobState.SUCCESS, projects_constants.DataSourceJobState.SUCCESS),
            (projects_constants.DataSourceJobState.FAILED, projects_constants.DataSourceJobState.FAILED),
            (projects_constants.DataSourceJobState.SUCCESS, projects_constants.DataSourceJobState.FAILED),
            (projects_constants.DataSourceJobState.FAILED, projects_constants.DataSourceJobState.SUCCESS),
        ],
    )
    def test_changing_data_with_same_job_state(
        self, api_client, job_factory, initial_job_state, new_job_state, lambda_auth_token
    ):
        initial = dict(result="path/to/result.csv", error="Error")
        job = job_factory(job_state=initial_job_state, **initial)
        payload = dict(job_state=new_job_state, result="path/to/other-result.csv", error='Other error')

        api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token)
        )
        job.refresh_from_db()

        # Data should stay the same
        assert job.result == initial["result"]
        assert job.error == initial["error"]

    def test_job_state_not_authenticated(self, api_client, job_factory):
        job = job_factory(job_state=projects_constants.DataSourceJobState.PENDING, result=None, error="")
        payload = dict(
            job_state=projects_constants.DataSourceJobState.PROCESSING,
            result="path/to/result.csv",
            error="test",
        )

        response = api_client.post(self.get_url(job.pk), payload)
        job.refresh_from_db()

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_job_state_not_authenticated_by_jwt_token(self, api_client, job_factory, admin):
        job = job_factory(job_state=projects_constants.DataSourceJobState.PENDING, result=None, error="")
        payload = dict(
            job_state=projects_constants.DataSourceJobState.PROCESSING,
            result="path/to/result.csv",
            error="test",
        )

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="JWT {}".format(admin.get_jwt_token())
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasourcejob-update-state", kwargs=dict(pk=pk))


class TestDataSourceScriptsView:
    def test_response(self, api_client, rf, admin, data_source_factory, script_factory):
        data_source_1 = data_source_factory()
        data_source_2 = data_source_factory()
        scripts_1 = script_factory.create_batch(3, is_predefined=False, datasource=data_source_1)
        scripts_2 = script_factory.create_batch(2, is_predefined=True, datasource=None)
        script_factory.create_batch(2, is_predefined=False, datasource=data_source_2)
        test_scripts = scripts_1 + scripts_2

        request = rf.get(self.get_url(data_source_1.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(data_source_1.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 5
        assert (
            response.data
            == projects_serializers.DataSourceScriptSerializer(
                self.sort_scripts(test_scripts), many=True, context={"request": request}
            ).data
        )

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-script", kwargs=dict(pk=pk))

    @staticmethod
    def sort_scripts(scripts):
        return sorted(scripts, key=operator.attrgetter("is_predefined"), reverse=True)


class TestDataSourceScriptUploadView:
    def test_response(self, api_client, admin, data_source_factory, faker):
        data_source = data_source_factory()
        code = b"df = df.head(5)"
        payload = dict(file=faker.python_upload_file(filename="test.py", code=code))
        script_name = os.path.splitext(payload["file"].name)[0]

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), payload, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        assert data_source.scripts.filter(name=script_name).exists()
        assert data_source.scripts.get(name=script_name).body == code.decode()

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-script-upload", kwargs=dict(pk=pk))


class TestScriptDetailView:
    def test_response(self, api_client, rf, admin, script_factory):
        script = script_factory()

        request = rf.get(self.get_url(script.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(script.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data
            == projects_serializers.WranglingScriptSerializer(script, context={"request": request}).data
        )

    @staticmethod
    def get_url(pk):
        return reverse("projects:script_detail", kwargs=dict(pk=pk))


class TestJobDetailView:
    def test_response(self, api_client, rf, admin, job_factory, job_step_factory):
        job = job_factory()
        job_step_factory.create_batch(2, datasource_job=job)

        request = rf.get(self.get_url(job.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(job.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["steps"]) == 2
        assert (
            response.data
            == projects_serializers.DataSourceJobSerializer(job, context={"request": request}).data
        )

    def test_description_is_allowed_to_edit(self, api_client, admin, job_factory, job_step_factory):
        job = job_factory()
        job_step_factory.create_batch(2, datasource_job=job)
        valid_payload = dict(descriprion="new desc")

        api_client.force_authenticate(admin)
        valid_response = api_client.patch(self.get_url(job.id), data=valid_payload)

        assert valid_response.status_code == status.HTTP_200_OK

    def test_cant_edit_non_description_fields(self, api_client, admin, job_factory, job_step_factory, faker):
        job = job_factory()
        job_step_factory.create_batch(2, datasource_job=job)
        valid_payload = dict(
            error="new desc",
            steps=[{"script": 10, "exec_order": 0}],
            result=faker.csv_upload_file(filename="test_result.csv"),
        )
        old_error = job.error
        old_steps = job.steps

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(job.id), data=valid_payload)
        job.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert job.error == old_error
        assert job.result.name == ""
        assert job.steps == old_steps

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasourcejob-detail", kwargs=dict(pk=pk))


class TestJobResultPreviewView:
    def test_response(self, api_client, admin, job_factory, job_step_factory, faker):
        job = job_factory(job_state=projects_constants.DataSourceJobState.SUCCESS)
        job_step_factory.create_batch(2, datasource_job=job)
        job.result = faker.csv_upload_file(filename="test_result.csv")
        job.save()
        job.update_meta()

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(job.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == job.meta_data.data

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasourcejob-result-preview", kwargs=dict(pk=pk))


class TestFilterListView:
    def test_response(self, api_client, admin, filter_factory, data_source):
        filter_factory.create_batch(2, datasource=data_source)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        assert response.data == projects_serializers.FilterSerializer(data_source.filters, many=True).data

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-filters", kwargs=dict(pk=pk))


class TestFilterCreateView:
    def test_response(self, api_client, admin, data_source):
        payload = dict(
            name="Test",
            filter_type=projects_constants.FilterType.RADIO_BUTTON.value,
            field="Date of Birth",
            field_type=projects_constants.FieldType.DATE,
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        filter_id = response.data["id"]
        filter_ = projects_models.Filter.objects.get(pk=filter_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == projects_serializers.FilterSerializer(filter_).data

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-filters", kwargs=dict(pk=pk))


class TestFilterDetailView:
    def test_response(self, api_client, admin, filter_):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(filter_.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.FilterSerializer(instance=filter_).data

    def test_update(self, api_client, admin, filter_):
        new_name = "NewFilter"
        payload = dict(name=new_name, type=projects_constants.FilterType.CHECKBOX)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(filter_.id), data=payload)
        filter_.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert filter_.name == new_name
        assert response.data == projects_serializers.FilterSerializer(instance=filter_).data

    @staticmethod
    def get_url(pk):
        return reverse("projects:filter-detail", kwargs=dict(pk=pk))


class TestRevertJobView:
    def test_response(self, api_client, data_source, admin, job_factory, mocker):
        jobs = job_factory.create_batch(
            3, datasource=data_source, job_state=projects_constants.DataSourceJobState.SUCCESS
        )
        payload = dict(id=jobs[1].id)
        old_active_job = data_source.active_job
        create_meta_file_mock = mocker.patch("schemacms.projects.models.DataSource.create_meta_file")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload)
        data_source.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert data_source.active_job != old_active_job
        assert data_source.active_job == jobs[1]
        create_meta_file_mock.assert_called_with()

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-revert-job", kwargs=dict(pk=pk))


class TestSetFiltersView:
    def test_response(self, api_client, admin, data_source, filter_factory):
        filter1 = filter_factory(datasource=data_source, is_active=False)
        filter2 = filter_factory(datasource=data_source, is_active=True)
        filter1_old_status = filter1.is_active
        filter2_old_status = filter2.is_active
        payload = {"active": [filter1.id], "inactive": [filter2.id]}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        filter1.refresh_from_db()
        filter2.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert filter1_old_status != filter1.is_active
        assert filter2_old_status != filter2.is_active

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-set-filters", kwargs=dict(pk=pk))


class TestDirectoryListView:
    def test_response(self, api_client, admin, project, folder_factory):
        folders = folder_factory.create_batch(2, project=project, created_by=admin)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url())

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data["results"]
            == projects_serializers.FolderSerializer(instance=self.sort_directories(folders), many=True).data
        )

    def test_response_from_projects(self, api_client, admin, project_factory, folder_factory):
        project_1, project_2 = project_factory.create_batch(2, owner=admin)
        folders = folder_factory.create_batch(3, project=project_1, created_by=admin)
        folder_factory.create_batch(2, project=project_2, created_by=admin)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_project_url(project_1.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        assert (
            response.data
            == projects_serializers.FolderSerializer(instance=self.sort_directories(folders), many=True).data
        )

    @staticmethod
    def get_url():
        return reverse("projects:folder-list")

    @staticmethod
    def get_project_url(pk):
        return reverse("projects:project-folders", kwargs=dict(pk=pk))

    @staticmethod
    def sort_directories(iterable):
        return sorted(iterable, key=operator.attrgetter("name"))


class TestFolderCreateView:
    def test_response(self, api_client, admin, project, faker):
        payload = dict(name=faker.word(), project=project.id)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(), data=payload)
        folder = projects_models.Folder.objects.get(pk=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert projects_models.Folder.objects.filter(pk=response.data["id"]).exists()
        assert response.data == projects_serializers.FolderSerializer(folder).data

    def test_add_folder_to_project(self, api_client, admin, project, faker):
        payload = {"name": "About"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_project_url(project.id), data=payload, format="json")
        project_folders = project.folders.all()

        assert response.status_code == status.HTTP_201_CREATED
        assert project_folders.count() == 1
        assert response.data == projects_serializers.FolderSerializer(project_folders[0]).data

    @staticmethod
    def get_url():
        return reverse("projects:folder-list")

    @staticmethod
    def get_project_url(pk):
        return reverse("projects:project-folders", kwargs=dict(pk=pk))


class TestFolderDetailView:
    def test_response(self, api_client, admin, folder):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(folder.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.FolderSerializer(folder).data

    def test_edit_name(self, api_client, admin, folder, faker):
        new_name = faker.word()
        payload = {"name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(folder.id), data=payload)
        folder.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert folder.name == new_name

    def test_update_folder(self, api_client, admin, project, project_factory, folder, faker):
        new_project = project_factory(owner=admin)
        new_name = faker.word()
        payload = dict(name=new_name, project=new_project.id)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(folder.id), data=payload, format="json")
        folder.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == new_name
        assert folder.project_id == project.id

    def test_delete_folder(self, api_client, user, folder):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=folder.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Folder.objects.all().filter(pk=folder.pk).exists()
        assert projects_models.Folder.objects.all_with_deleted().filter(pk=folder.pk).exists()

    @staticmethod
    def get_url(pk):
        return reverse("projects:folder-detail", kwargs=dict(pk=pk))


class TestPageListCreateView:
    def test_response(self, api_client, admin, folder, page_factory):
        pages = page_factory.create_batch(2, folder=folder, created_by=admin)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(folder.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data
            == projects_serializers.PageSerializer(instance=self.sort_directories(pages), many=True).data
        )

    def test_create(self, api_client, admin, folder, faker):
        payload = dict(title=faker.word())

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(folder.id), data=payload, format="json")
        folder_pages = folder.pages.all()

        assert response.status_code == status.HTTP_201_CREATED
        assert folder_pages.count() == 1
        assert response.data == projects_serializers.PageSerializer(folder_pages[0]).data

    @staticmethod
    def get_url(pk):
        return reverse("projects:folder-pages", kwargs=dict(pk=pk))

    @staticmethod
    def sort_directories(iterable):
        return sorted(iterable, key=operator.attrgetter("created"))


class TestPageDetailView:
    def test_response(self, api_client, admin, page):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(page.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.PageDetailSerializer(page).data

    def test_update_page(self, api_client, admin, folder, folder_factory, page, faker):
        new_folder = folder_factory()
        new_title = faker.word()
        payload = dict(title=new_title, folder=new_folder.id)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        page.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == new_title
        assert page.folder_id == folder.id

    def test_delete_page(self, api_client, user, page):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=page.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Page.objects.all().filter(pk=page.pk).exists()
        assert projects_models.Page.objects.all_with_deleted().filter(pk=page.pk).exists()

    @staticmethod
    def get_url(pk):
        return reverse("projects:page-detail", kwargs=dict(pk=pk))


class TestBlockListCreateView:
    def test_response(self, api_client, admin, page, block_factory):
        blocks = block_factory.create_batch(2, page=page)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(page.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data
            == projects_serializers.BlockSerializer(instance=self.sort_directories(blocks), many=True).data
        )

    def test_create(self, api_client, admin, page, faker):
        payload = dict(name=faker.word(), type=projects_constants.BlockTypes.CODE, content="<p>test</p>")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="json")
        page_blocks = page.blocks.all()

        assert response.status_code == status.HTTP_201_CREATED
        assert page_blocks.count() == 1
        assert response.data == projects_serializers.BlockSerializer(page_blocks[0]).data

    def test_image_upload(self, api_client, admin, page, faker):
        payload = dict(
            name=faker.word(), type=projects_constants.BlockTypes.IMAGE, image=faker.image_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="multipart")
        block = page.blocks.get(pk=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert block.image.name == f'/pages/{page.id}/test.png'

    def test_400_on_image_upload_with_wrong_type(self, api_client, admin, page, faker):
        payload = dict(
            name=faker.word(), type=projects_constants.BlockTypes.TEXT, image=faker.image_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_400_on_sending_type_image_without_file(self, api_client, admin, page, faker):
        payload = dict(name=faker.word(), type=projects_constants.BlockTypes.IMAGE)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @staticmethod
    def get_url(pk):
        return reverse("projects:page-blocks", kwargs=dict(pk=pk))

    @staticmethod
    def sort_directories(iterable):
        return sorted(iterable, key=operator.attrgetter("created"))


class TestBlockDetailView:
    def test_response(self, api_client, admin, block):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(block.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == projects_serializers.BlockDetailSerializer(block).data

    def test_update_block(self, api_client, admin, page, page_factory, block, faker):
        new_page = page_factory()
        new_name = faker.word()
        payload = dict(name=new_name, page=new_page.id)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(block.id), data=payload, format="json")
        block.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == new_name
        assert block.page_id == page.id

    def test_delete_block(self, api_client, user, block):
        api_client.force_authenticate(user)

        response = api_client.delete(self.get_url(pk=block.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not projects_models.Block.objects.all().filter(pk=block.pk).exists()
        assert projects_models.Block.objects.all_with_deleted().filter(pk=block.pk).exists()

    @staticmethod
    def get_url(pk):
        return reverse("projects:block-detail", kwargs=dict(pk=pk))


class TestSetBlocksView:
    def test_response(self, api_client, admin, folder, page_factory, block_factory):
        page = page_factory(folder=folder)
        block1 = block_factory(page=page, is_active=False)
        block2 = block_factory(page=page, is_active=True)
        block1_old_status = block1.is_active
        block2_old_status = block2.is_active
        payload = {"active": [block1.id], "inactive": [block2.id]}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(page.id), data=payload, format="json")
        block1.refresh_from_db()
        block2.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert block1_old_status != block1.is_active
        assert block2_old_status != block2.is_active

    @staticmethod
    def get_url(pk):
        return reverse("projects:page-set-blocks", kwargs=dict(pk=pk))
