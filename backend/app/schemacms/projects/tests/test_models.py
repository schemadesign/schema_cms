import os
import json

import pytest
from factory.django import FileField
from pandas import read_csv

from schemacms.utils.test import make_csv
from schemacms.projects.models import get_preview_data
from schemacms.projects.tests.factories import DataSourceFactory


pytestmark = [pytest.mark.django_db]


class TestProject:
    def test_data_source_count(self, faker, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)

        assert project.data_source_count == expected


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

    def test_creating_meta(self):
        filename = "file_path_test.csv"
        dsource = self.create_dsource(filename)

        items, fields = read_csv(dsource.file.path).shape
        assert dsource.meta_data.fields == fields
        assert dsource.meta_data.items == items

    def test_updating_meta(self, data_source):
        cols_number = 4
        rows_number = 3
        new_file = make_csv(cols_number, rows_number)

        old_preview = data_source.meta_data.preview

        data_source.file.save("new_file.csv", new_file)
        data_source.update_meta()
        data_source.refresh_from_db()

        assert data_source.meta_data.fields == cols_number
        assert data_source.meta_data.items == rows_number
        assert data_source.meta_data.preview != old_preview

    def test_get_preview(self, data_source):
        source_file = data_source.file

        data_source.update_meta()
        expected_preview, _, _ = get_preview_data(source_file)
        result_json = json.loads(data_source.meta_data.preview.read())

        assert json.loads(expected_preview)["data"] == result_json["data"]
        assert json.loads(expected_preview)["fields"] == result_json["fields"]

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

    def test_meta_file_serialization(self, data_source_factory, job_factory, job_meta_factory):
        ds = data_source_factory()
        job = job_factory(datasource=ds)
        job_meta = job_meta_factory(job=job)
        ds.active_job = job
        ds.save(update_fields=["active_job"])

        ret = ds.meta_file_serialization()

        assert ret == {
            'id': ds.id,
            'name': ds.name,
            'file': ds.file.name,
            'items': job_meta.items,
            'result': "",
        }


class TestDataSourceMeta:
    @pytest.mark.parametrize("offset, whence", [(0, 0), (0, 2)])  # test different file cursor positions
    def test_data(self, data_source_meta, offset, whence):
        expected = json.loads(data_source_meta.preview.read())
        data_source_meta.preview.seek(offset, whence)

        assert data_source_meta.data == expected


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
