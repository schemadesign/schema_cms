import os
import json

import pytest
from factory.django import FileField

from schemacms.utils.test import make_csv
from schemacms.projects.tests.factories import DataSourceFactory
from schemacms.projects import models as project_models


pytestmark = [pytest.mark.django_db]


class TestProject:
    def test_data_source_count(self, faker, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)

        assert project.data_source_count == expected

    def test_meta_file_serialization(
        self, admin, project_factory, data_source_factory, folder_factory, page_factory, block_factory
    ):
        project = project_factory(owner=admin)
        ds = data_source_factory(project=project)
        folder = folder_factory(project=project)
        page = page_factory(folder=folder)
        block_factory.create_batch(2, page=page)

        project.refresh_from_db()
        ret = project.meta_file_serialization()

        assert ret == {
            'id': project.id,
            'title': project.title,
            "description": project.description,
            'owner': admin.get_full_name(),
            'data_sources': [{"id": ds.id, "name": ds.name, "type": ds.type}],
            'pages': folder.meta_file_serialization(),
        }

    def test_get_projects_for_user(self, faker, project_factory, user):
        projects = project_factory.create_batch(3, editors=[user])
        assert projects == list(project_models.Project.get_projects_for_user(user))


class TestDataSource:
    """
    Tests DataSource model additional methods
    """

    @staticmethod
    def create_dsource(filename):
        return DataSourceFactory.create(
            name="Test Data Source",
            file=FileField(filename=filename, data=make_csv().getvalue()),
            meta_data=None,
        )

    def test_file_path(self):
        filename = "file_path_test.csv"
        dsource = self.create_dsource(filename)

        base_path = dsource.file.storage.location
        correct_path = os.path.join(base_path, f"{dsource.id}/uploads/{filename}")

        assert correct_path == dsource.file.path

    def test_source_file_latest_version(self, mocker, data_source_factory, s3_object_version_factory):
        ds = data_source_factory()
        file_versions = (
            s3_object_version_factory(ds.file.name),
            s3_object_version_factory(ds.file.name),
            s3_object_version_factory(ds.file.name, is_latest=True),
        )
        storage_mock = mocker.patch("schemacms.utils.storages.OverwriteStorage")
        storage_mock.bucket.object_versions.filter.return_value = file_versions
        ds.file.storage = storage_mock

        assert ds.source_file_latest_version == file_versions[-1].id

    @pytest.mark.usefixtures("ds_source_file_latest_version_mock")
    def test_create_job(self, faker, data_source_factory):
        ds = data_source_factory()

        job = ds.create_job()

        assert job.datasource == ds
        assert job.source_file_path == ds.file.name
        assert job.source_file_version == ds.source_file_latest_version

    def test_meta_file_serialization(self, data_source_factory, job_factory):
        ds = data_source_factory()
        job = job_factory(datasource=ds)
        job.result = ds.file
        job.save()
        ds.active_job = job
        preview_data = {
            'fields': {
                'col_0': {'dtype': 'boolean'},
                'col_1': {'dtype': 'boolean'},
                'col_2': {'dtype': 'number'},
            }
        }
        ds.active_job.update_meta(
            preview=preview_data, items=0, fields=0, fields_names=[], fields_with_urls=[]
        )

        ds.save(update_fields=["active_job"])
        ds.refresh_from_db()
        ret = ds.meta_file_serialization()

        assert ret == {
            'id': ds.id,
            'name': ds.name,
            'file': ds.file.name,
            'items': job.meta_data.items,
            'result': job.result,
            'filters': [],
            'fields': [
                {'name': 'col_0', 'type': 'boolean'},
                {'name': 'col_1', 'type': 'boolean'},
                {'name': 'col_2', 'type': 'number'},
            ],
        }


class TestDataSourceMeta:
    @pytest.mark.parametrize("offset, whence", [(0, 0), (0, 2)])  # test different file cursor positions
    def test_data(self, data_source_factory, offset, whence):
        ds = data_source_factory()
        ds.update_meta(preview={"test": "test"}, items=0, fields=0, fields_names=[])

        ds.meta_data.refresh_from_db()
        expected = json.loads(ds.meta_data.preview.read())
        ds.meta_data.preview.seek(offset, whence)

        assert ds.meta_data.data == expected

    def test_data_when_preview_does_not_exists(self, data_source_factory):
        data_source = data_source_factory()
        assert data_source.meta_data.data == {}


class TestDataSourceJob:
    def test_source_file_url(self, job_factory, default_storage, settings, s3, faker):
        job = job_factory(source_file_path="path/to/file", source_file_version="123")
        expected_url = faker.url()
        s3.generate_presigned_url.return_value = expected_url
        settings.AWS_STORAGE_BUCKET_NAME = "schemacms"

        url = job.source_file_url

        assert url == expected_url
        s3.generate_presigned_url.assert_called_with(
            ClientMethod='get_object',
            Params={
                **self._get_common_generate_presigned_url_params(settings, job),
                'VersionId': job.source_file_version,
            },
        )

    def test_source_file_url_without_file_path(self, job_factory, default_storage):
        job = job_factory(source_file_path="")

        assert job.source_file_url == ""

    def test_source_file_url_without_file_version(self, job_factory, settings, s3, faker):
        job = job_factory(source_file_version="")
        expected_url = faker.url()
        s3.generate_presigned_url.return_value = expected_url

        url = job.source_file_url

        assert url == expected_url
        s3.generate_presigned_url.assert_called_with(
            ClientMethod='get_object',
            Params={**self._get_common_generate_presigned_url_params(settings, job)},
        )

    def _get_common_generate_presigned_url_params(self, settings, job):
        filename = os.path.basename(job.source_file_path)
        return {
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': job.source_file_path,
            'ResponseContentDisposition': f"attachment; filename={filename}",
        }
