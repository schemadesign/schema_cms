import json
import operator
import os
import uuid

import pytest
from django.conf import settings
from django.core.files import base
from django.urls import reverse
from rest_framework import status

from schemacms.datasources import constants as ds_constants
from schemacms.datasources import models as ds_models
from schemacms.datasources import serializers as ds_serializers
from schemacms.projects import constants as projects_constants
from schemacms.utils import error

pytestmark = [pytest.mark.django_db]


def multisort(xs, specs):
    for key, reverse_ in reversed(specs):
        xs.sort(key=operator.attrgetter(key), reverse=reverse_)
    return xs


class TestCreateDataSourceView:
    @staticmethod
    def generate_payload(project, faker):
        payload = {
            "project": project.id,
            "name": faker.word(),
            "type": ds_constants.DataSourceType.FILE,
            "file": faker.csv_upload_file(),
        }
        return payload

    def test_empty_payload(self, api_client, admin, project):
        api_client.force_authenticate(admin)

        response = api_client.post(self.get_url(), dict(project=project.id), format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_without_file(self, api_client, admin, project, faker, mocker):
        api_client.force_authenticate(admin)
        payload = self.generate_payload(project, faker)
        payload.pop("file")
        schedule_update_meta_mock = mocker.patch(
            "schemacms.datasources.models.DataSource.schedule_update_meta"
        )

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        schedule_update_meta_mock.assert_not_called()

    @pytest.mark.usefixtures("sqs")
    def test_create_by_editor_assigned_to_project(self, api_client, editor, project, faker, mocker):
        project.editors.add(editor)
        api_client.force_authenticate(editor)
        payload = self.generate_payload(project, faker)
        schedule_update_meta_mock = mocker.patch(
            "schemacms.datasources.models.DataSource.schedule_update_meta"
        )

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        schedule_update_meta_mock.assert_called_once()

    @pytest.mark.usefixtures("sqs")
    def test_create_by_editor_not_assigned_to_project(self, api_client, editor, project, faker):
        api_client.force_authenticate(editor)
        payload = self.generate_payload(project, faker)

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_request_user_as_created_by(self, api_client, admin, project, faker, mocker):
        api_client.force_authenticate(admin)
        payload = self.generate_payload(project, faker)
        schedule_update_meta_mock = mocker.patch(
            "schemacms.datasources.models.DataSource.schedule_update_meta"
        )

        response = api_client.post(self.get_url(), payload, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED, response.content
        assert project.data_sources.get(id=response.data["id"]).created_by == admin
        schedule_update_meta_mock.assert_called_with(False)

    @staticmethod
    def get_url():
        return reverse("datasources:datasource-list")


@pytest.mark.usefixtures("sqs")  # mock s3 sqs calls
class TestUpdateDataSourceView:
    def test_response(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=ds_constants.DataSourceType.FILE, file=faker.csv_upload_file(),
        )

        api_client.force_authenticate(admin)
        response = api_client.patch(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK

    def test_object_in_db(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(),
            type=ds_constants.DataSourceType.FILE,
            file=faker.csv_upload_file(filename="filename.csv"),
        )
        api_client.force_authenticate(admin)

        api_client.patch(url, payload, format="multipart")

        data_source.refresh_from_db()
        assert data_source.get_original_file_name()[1] == payload["file"].name

    def test_update_without_file(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(name=faker.word())
        api_client.force_authenticate(admin)

        api_client.patch(url, payload, format="multipart")

        data_source.refresh_from_db()
        assert data_source.name == payload["name"]

    def test_schedule_update_meta(self, api_client, faker, mocker, admin, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(),
            type=ds_constants.DataSourceType.FILE,
            file=faker.csv_upload_file(filename="filename.csv"),
        )
        api_client.force_authenticate(admin)
        schedule_update_meta_mock = mocker.patch(
            "schemacms.datasources.models.DataSource.schedule_update_meta"
        )

        api_client.patch(url, payload, format="multipart")

        schedule_update_meta_mock.assert_called_once()

    def test_update_by_editor_assigned_to_project(
        self, api_client, faker, editor, project, data_source_factory
    ):
        project.editors.add(editor)
        data_source = data_source_factory(project=project)
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=ds_constants.DataSourceType.FILE, file=faker.csv_upload_file(),
        )

        api_client.force_authenticate(editor)
        response = api_client.patch(url, payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK

    def test_update_by_editor_not_assigned_to_project(self, api_client, faker, editor, data_source_factory):
        data_source = data_source_factory()
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=faker.word(), type=ds_constants.DataSourceType.FILE, file=faker.csv_upload_file(),
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
        assert response.data.keys() == {"name", "type"}

    def test_unique_name(self, api_client, faker, admin, data_source_factory):
        other_datasource = data_source_factory(name="test")
        data_source = data_source_factory(project=other_datasource.project)
        url = self.get_url(pk=data_source.pk)
        payload = dict(
            name=other_datasource.name, type=ds_constants.DataSourceType.FILE, file=faker.csv_upload_file(),
        )
        api_client.force_authenticate(admin)

        response = api_client.patch(url, payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST, response.content
        assert response.data == {
            "name": [
                error.Error(
                    message="DataSource with this name already exist in project.",
                    code="dataSourceProjectNameUnique",
                ).data
            ]
        }

    @pytest.mark.parametrize(
        "job_status", [ds_constants.ProcessingState.PENDING, ds_constants.ProcessingState.PROCESSING],
    )
    def test_error_file_reupload_when_job_is_processing(
        self, api_client, faker, admin, data_source_factory, job_factory, job_status
    ):
        data_source = data_source_factory()
        job_factory(datasource=data_source, job_state=job_status)
        payload = dict(
            name=faker.word(), type=ds_constants.DataSourceType.FILE, file=faker.csv_upload_file(),
        )

        api_client.force_authenticate(admin)
        response = api_client.put(self.get_url(pk=data_source.pk), payload, format="multipart")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_file_overwrite(self, api_client, faker, admin, data_source_factory):
        data_source = data_source_factory()
        data_source.update_meta(preview_data={}, items=0, fields=0, fields_names=[])
        _, file_name_before_update = data_source.get_original_file_name()
        payload = dict(type=ds_constants.DataSourceType.FILE, file=faker.csv_upload_file())

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(pk=data_source.pk), payload, format="multipart")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["file_name"] == file_name_before_update

    def test_url(self, data_source):
        assert f"/api/v1/datasources/{data_source.pk}" == self.get_url(pk=data_source.pk)

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-detail", kwargs=dict(pk=pk))


class TestDataSourceUpdateMeta:
    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-update-meta", kwargs=dict(pk=pk))

    @staticmethod
    def generate_update_meta_payload(datasource_pk, is_status_update=False):
        if is_status_update:
            payload = dict(datasource_pk=datasource_pk, status=ds_constants.ProcessingState.PROCESSING,)
        else:
            payload = dict(
                items=2,
                fields=2,
                fields_names=["fields_1", "field2"],
                fields_with_urls=[],
                preview={"preview": "test"},
                copy_steps=False,
                status=projects_constants.ProcessingState.SUCCESS,
            )
        return payload

    @pytest.mark.parametrize(
        "token, response_status",
        [
            ("invalidToken", status.HTTP_401_UNAUTHORIZED),
            (settings.LAMBDA_AUTH_TOKEN, status.HTTP_204_NO_CONTENT),
        ],
    )
    def test_authentication_on_update_meta(self, api_client, data_source, token, response_status):
        response = api_client.post(
            self.get_url(data_source.pk), {}, HTTP_AUTHORIZATION=f"Token {token}", format="json",
        )

        assert response.status_code == response_status

    def test_status_update(self, api_client, data_source):
        old_datasource_status = data_source.meta_data.status
        payload = self.generate_update_meta_payload(datasource_pk=data_source.pk, is_status_update=True)

        response = api_client.post(
            self.get_url(data_source.pk),
            payload,
            HTTP_AUTHORIZATION=f"Token {settings.LAMBDA_AUTH_TOKEN}",
            format="json",
        )
        data_source.meta_data.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert data_source.meta_data.status != old_datasource_status
        assert data_source.meta_data.status == ds_constants.ProcessingState.PROCESSING

    @pytest.mark.usefixtures("create_fake_job")
    @pytest.mark.usefixtures("transaction_on_commit")
    def test_meta_update(self, api_client, data_source):
        payload = self.generate_update_meta_payload(datasource_pk=data_source.pk)

        response = api_client.post(
            self.get_url(data_source.pk),
            payload,
            HTTP_AUTHORIZATION=f"Token {settings.LAMBDA_AUTH_TOKEN}",
            format="json",
        )
        data_source.meta_data.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert data_source.meta_data.status == projects_constants.ProcessingState.SUCCESS
        assert data_source.meta_data.items == payload["items"]
        assert data_source.meta_data.fields == payload["fields"]
        assert data_source.meta_data.fields_names == payload["fields_names"]


class TestDataSourcePreview:
    def test_response(self, api_client, admin, data_source):
        api_client.force_authenticate(admin)

        data_source.update_meta(preview={"test": "test"}, items=2, fields=2, fields_names=["col1", "col2"])
        data_source.meta_data.refresh_from_db()

        expected_data = dict(
            results=json.loads(data_source.meta_data.preview.read()),
            data_source={"name": data_source.name},
            project=data_source.project_info,
        )

        response = api_client.get(self.get_url(data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-preview", kwargs=dict(pk=pk))


@pytest.mark.usefixtures("ds_source_file_latest_version_mock")
class TestDataSourceJobCreate:
    @pytest.mark.parametrize("description", ["", "test_desc"])
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
    def test_schedule_datasource_processing(
        self, api_client, admin, data_source_factory, script_factory, mocker
    ):
        schedule_datasource_processing = mocker.patch(
            "schemacms.utils.services.schedule_job_scripts_processing"
        )
        data_source = data_source_factory(created_by=admin)
        script_1 = script_factory(is_predefined=True, created_by=admin, datasource=None)
        job_data = dict(steps=[{"script": script_1.id, "exec_order": 0}])

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=job_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        job = ds_models.DataSourceJob.objects.all().get(pk=response.data["id"])
        schedule_datasource_processing.assert_called_with(job, data_source.file.size)

    def test_step_with_options(self, api_client, admin, data_source_factory, script_factory):
        data_source = data_source_factory(created_by=admin)
        script_1 = script_factory(is_predefined=True, created_by=admin, datasource=None)
        job_data = dict(steps=[{"script": script_1.id, "exec_order": 0, "options": {"columns": ["A", "B"]}}])

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=job_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        step = ds_models.DataSourceJobStep.objects.get(datasource_job_id=response.data["id"])
        assert step.options == job_data["steps"][0]["options"]

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-job", kwargs=dict(pk=pk))


@pytest.mark.usefixtures("ds_source_file_latest_version_mock")
class TestDataSourceJobUpdateState:
    @pytest.fixture()
    def lambda_auth_token(self, settings):
        settings.LAMBDA_AUTH_TOKEN = uuid.uuid4().hex
        return settings.LAMBDA_AUTH_TOKEN

    def test_job_state_from_pending_to_processing(self, api_client, job_factory, lambda_auth_token):
        job = job_factory(job_state=ds_constants.ProcessingState.PENDING, result=None, error="")
        payload = dict(
            job_state=ds_constants.ProcessingState.PROCESSING, result="path/to/result.csv", error="test",
        )

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token),
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT, response.content
        assert job.job_state == payload["job_state"]
        assert not job.result
        assert job.error == ""

    def test_job_state_from_processing_to_success(
        self, api_client, job_factory, mocker, lambda_auth_token, default_storage
    ):
        job = job_factory(job_state=ds_constants.ProcessingState.PROCESSING, result=None, error="",)
        default_storage.save(name="path/to/result.csv", content=base.ContentFile("test,1,2".encode()))
        payload = dict(
            job_state=projects_constants.ProcessingState.SUCCESS, result="path/to/result.csv", error="test",
        )
        set_active_job_mock = mocker.patch("schemacms.datasources.models.DataSource.set_active_job")

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
        job = job_factory(job_state=ds_constants.ProcessingState.PROCESSING, result=None)
        payload = dict(
            job_state=ds_constants.ProcessingState.FAILED,
            result="path/to/result.csv",
            error="Something goes wrong",
        )

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token),
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT, response.content
        assert job.job_state == payload["job_state"]
        assert job.error == payload["error"]
        assert not job.result

    @pytest.mark.parametrize(
        "job_state", [ds_constants.ProcessingState.SUCCESS, ds_constants.ProcessingState.FAILED],
    )
    def test_job_state_to_pending(self, api_client, job_factory, job_state, lambda_auth_token):
        job = job_factory(job_state=job_state)
        payload = dict(job_state=ds_constants.ProcessingState.PENDING)

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token),
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "job_state": [{"code": "invalid_choice", "message": '"pending" is not a valid choice.'}]
        }

    @pytest.mark.parametrize(
        "initial_job_state, new_job_state",
        [
            (ds_constants.ProcessingState.SUCCESS, ds_constants.ProcessingState.SUCCESS,),
            (ds_constants.ProcessingState.FAILED, ds_constants.ProcessingState.FAILED,),
            (ds_constants.ProcessingState.SUCCESS, ds_constants.ProcessingState.FAILED,),
            (ds_constants.ProcessingState.FAILED, ds_constants.ProcessingState.SUCCESS,),
        ],
    )
    def test_changing_data_with_same_job_state(
        self, api_client, job_factory, initial_job_state, new_job_state, lambda_auth_token,
    ):
        initial = dict(result="path/to/result.csv", error="Error")
        job = job_factory(job_state=initial_job_state, **initial)
        payload = dict(job_state=new_job_state, result="path/to/other-result.csv", error="Other error",)

        api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="Token {}".format(lambda_auth_token),
        )
        job.refresh_from_db()

        # Data should stay the same
        assert job.result == initial["result"]
        assert job.error == initial["error"]

    def test_job_state_not_authenticated(self, api_client, job_factory):
        job = job_factory(job_state=projects_constants.ProcessingState.PENDING, result=None, error="")
        payload = dict(
            job_state=projects_constants.ProcessingState.PROCESSING,
            result="path/to/result.csv",
            error="test",
        )

        response = api_client.post(self.get_url(job.pk), payload)
        job.refresh_from_db()

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_job_state_not_authenticated_by_jwt_token(self, api_client, job_factory, admin):
        job = job_factory(job_state=projects_constants.ProcessingState.PENDING, result=None, error="")
        payload = dict(
            job_state=projects_constants.ProcessingState.PROCESSING,
            result="path/to/result.csv",
            error="test",
        )

        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION="JWT {}".format(admin.get_jwt_token()),
        )
        job.refresh_from_db()

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasourcejob-update-state", kwargs=dict(pk=pk))


class TestJobUpdateMeta:
    @staticmethod
    def generate_job_and_meta_payload(job_factory):
        job = job_factory(job_state=ds_constants.ProcessingState.PROCESSING, result=None, error="",)

        payload = dict(
            items=2,
            fields=2,
            fields_names=["fields_1", "field2"],
            fields_with_urls=[],
            preview={"preview": "test"},
        )
        return payload, job

    @pytest.mark.parametrize(
        "token, response_status",
        [
            ("invalidToken", status.HTTP_401_UNAUTHORIZED),
            (settings.LAMBDA_AUTH_TOKEN, status.HTTP_204_NO_CONTENT),
        ],
    )
    def test_authentication_on_update_meta(self, api_client, job_factory, token, response_status):
        payload, job = self.generate_job_and_meta_payload(job_factory)
        response = api_client.post(
            self.get_url(job.pk), payload, HTTP_AUTHORIZATION=f"Token {token}", format="json",
        )

        assert response.status_code == response_status

    def test_meta_is_updated(self, api_client, job_factory):
        payload, job = self.generate_job_and_meta_payload(job_factory)

        response = api_client.post(
            self.get_url(job.pk),
            payload,
            HTTP_AUTHORIZATION=f"Token {settings.LAMBDA_AUTH_TOKEN}",
            format="json",
        )
        job.refresh_from_db()
        job_meta_data = job.meta_data

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert job_meta_data.fields == payload["fields"]
        assert job_meta_data.items == payload["items"]
        assert job_meta_data.fields_names == payload["fields_names"]

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasourcejob-update-meta", kwargs=dict(pk=pk))


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
            == ds_serializers.DataSourceScriptSerializer(
                self.sort_scripts(test_scripts), many=True, context={"request": request}
            ).data
        )

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-script", kwargs=dict(pk=pk))

    @staticmethod
    def sort_scripts(scripts):
        return multisort(scripts, (("is_predefined", True), ("name", False)))


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
        return reverse("datasources:datasource-script-upload", kwargs=dict(pk=pk))


class TestScriptDetailView:
    def test_response(self, api_client, rf, admin, script_factory):
        script = script_factory()

        request = rf.get(self.get_url(script.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(script.id))

        assert response.status_code == status.HTTP_200_OK
        assert (
            response.data
            == ds_serializers.WranglingScriptSerializer(script, context={"request": request}).data
        )

    @staticmethod
    def get_url(pk):
        return reverse("datasources:script_detail", kwargs=dict(pk=pk))


class TestJobDetailView:
    def test_response(self, api_client, rf, admin, job_factory, job_step_factory):
        job = job_factory()
        job_step_factory.create_batch(2, datasource_job=job)

        request = rf.get(self.get_url(job.id))
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(job.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["steps"]) == 2
        assert response.data == ds_serializers.JobDetailSerializer(job, context={"request": request}).data

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
        return reverse("datasources:datasourcejob-detail", kwargs=dict(pk=pk))


class TestJobResultPreviewView:
    def test_response(self, api_client, admin, job_factory, job_step_factory, faker):
        job = job_factory(job_state=ds_constants.ProcessingState.SUCCESS)
        job_step_factory.create_batch(2, datasource_job=job)
        job.result = faker.csv_upload_file(filename="test_result.csv")
        job.save()
        job.update_meta(
            preview={"test": "test"}, items=3, fields=2, fields_names=["col1", "col2"], fields_with_urls=[],
        )

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(job.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == job.meta_data.data

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasourcejob-result-preview", kwargs=dict(pk=pk))


class TestFilterListView:
    def test_response(self, api_client, admin, filter_factory, data_source):
        filter_factory.create_batch(2, datasource=data_source)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2
        assert (
            response.data["results"] == ds_serializers.FilterSerializer(data_source.filters, many=True).data
        )
        assert response.data["project"] == {
            "id": data_source.project.id,
            "title": data_source.project.title,
        }

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-filters", kwargs=dict(pk=pk))


class TestFilterCreateView:
    def test_response(self, api_client, admin, data_source):
        payload = dict(
            name="Test",
            filter_type=ds_constants.FilterType.VALUE.value,
            field="Date of Birth",
            field_type=ds_constants.FieldType.DATE,
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        filter_id = response.data["id"]
        filter_ = ds_models.Filter.objects.get(pk=filter_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == ds_serializers.FilterSerializer(filter_).data

    def test_unique_together_validation(self, api_client, admin, data_source, filter_):
        existing_filter_name = filter_.name
        payload = dict(
            name=existing_filter_name,
            filter_type=ds_constants.FilterType.VALUE.value,
            field="Date of Birth",
            field_type=ds_constants.FieldType.DATE,
        )

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["name"][0]["code"] == "filterNameNotUnique"

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-filters", kwargs=dict(pk=pk))


class TestFilterDetailView:
    def test_response(self, api_client, admin, filter_):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(filter_.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == ds_serializers.FilterDetailsSerializer(instance=filter_).data

    def test_update(self, api_client, admin, filter_):
        new_name = "NewFilter"
        payload = dict(name=new_name, type=projects_constants.FilterType.CHECKBOX)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(filter_.id), data=payload)
        filter_.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert filter_.name == new_name
        assert response.data == ds_serializers.FilterDetailsSerializer(instance=filter_).data

    def test_update_unique_together_validation(self, api_client, admin, filter_, filter_factory):
        new_filter_name = "new_filter"
        filter_factory(name=new_filter_name, datasource=filter_.datasource)
        payload = {"name": new_filter_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(filter_.id), data=payload)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["name"][0]["code"] == "filterNameNotUnique"

    def test_delete(self, api_client, admin, filter_):
        api_client.force_authenticate(admin)
        response = api_client.delete(self.get_url(filter_.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not ds_models.Filter.objects.all().filter(pk=filter_.id).exists()

    @staticmethod
    def get_url(pk):
        return reverse("datasources:filter-detail", kwargs=dict(pk=pk))


class TestRevertJobView:
    def test_response(self, api_client, data_source, admin, job_factory, mocker):
        jobs = job_factory.create_batch(
            3, datasource=data_source, job_state=ds_constants.ProcessingState.SUCCESS,
        )
        payload = dict(id=jobs[1].id)
        old_active_job = data_source.active_job
        create_meta_file_mock = mocker.patch("schemacms.datasources.models.DataSource.create_dynamo_item")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload)
        data_source.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert data_source.active_job != old_active_job
        assert data_source.active_job == jobs[1]
        create_meta_file_mock.assert_called_with()

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-revert-job", kwargs=dict(pk=pk))


class TestSetFiltersView:
    def test_response(self, api_client, admin, data_source, filter_factory, mocker):
        filter1 = filter_factory(datasource=data_source, is_active=False)
        filter2 = filter_factory(datasource=data_source, is_active=True)
        filter1_old_status = filter1.is_active
        filter2_old_status = filter2.is_active
        payload = {"active": [filter1.id], "inactive": [filter2.id]}
        create_meta_file_mock = mocker.patch("schemacms.datasources.models.DataSource.create_dynamo_item")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        filter1.refresh_from_db()
        filter2.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert filter1_old_status != filter1.is_active
        assert filter2_old_status != filter2.is_active
        create_meta_file_mock.assert_called_with()

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-set-filters", kwargs=dict(pk=pk))
