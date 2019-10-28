import json
import operator
import os

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
        with django_assert_num_queries(3):
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
        assert response.data["meta"]["data_sources"] == {"count": expected}

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
        assert not projects_models.Project.objects.filter(pk=project.pk).exists()

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


class TestCreateDraftDataSourceView:
    def test_empty_payload(self, api_client, admin, project):
        api_client.force_authenticate(admin)

        response = api_client.post(self.get_url(), dict(project=project.id), format="multipart")

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_editor_assigned_to_project(self, api_client, editor, project):
        project.editors.add(editor)
        api_client.force_authenticate(editor)

        response = api_client.post(self.get_url(), dict(project=project.id), format="multipart")

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_by_editor_not_assigned_to_project(self, api_client, editor, project):
        api_client.force_authenticate(editor)

        response = api_client.post(self.get_url(), dict(project=project.id), format="multipart")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_upload_file(self, api_client, admin, project, faker):
        payload = dict(file=faker.csv_upload_file(filename="test.csv"), project=project.id)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(), payload, format="multipart")
        dsource = projects_models.DataSource.objects.get(id=response.data["id"])
        correct_path = os.path.join(dsource.file.storage.location, f"{dsource.id}/uploads/test.csv")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["file"] == f"http://testserver/{correct_path.lstrip('/')}"

    def test_request_user_as_created_by(self, api_client, admin, project):
        api_client.force_authenticate(admin)

        response = api_client.post(self.get_url(), dict(project=project.id), format="multipart")

        assert response.status_code == status.HTTP_201_CREATED, response.content
        assert project.data_sources.get(id=response.data["id"]).created_by == admin

    @staticmethod
    def get_url():
        return reverse("projects:datasource-list")


class TestUpdateDraftDataSourceView:
    def test_response(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.put(url, payload, format="multipart")

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

        api_client.put(url, payload, format="multipart")

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
        response = api_client.put(url, payload, format="multipart")

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
        assert response.data.keys() == {"name", "type", "file"}

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

        response = api_client.put(url, payload, format="multipart")

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
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=projects_constants.DataSourceType.FILE, file=faker.csv_upload_file()
        )

        api_client.force_authenticate(admin)
        response = api_client.put(url, payload, format="multipart")

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


class TestDataSourceJobCreate:
    @pytest.mark.usefixtures("ds_source_file_latest_version_mock")
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

    @staticmethod
    def get_url(pk):
        return reverse("projects:datasource-job", kwargs=dict(pk=pk))


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
        assert job.result.name == ''
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
