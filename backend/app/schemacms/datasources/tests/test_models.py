import json
import os

import pytest
from factory.django import FileField

from schemacms.utils.test import make_csv

from .factories import DataSourceFactory

pytestmark = [pytest.mark.django_db]


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
        ds.set_active_job(job)
        preview_data = {
            "fields": {
                "col_0": {"dtype": "boolean"},
                "col_1": {"dtype": "boolean"},
                "col_2": {"dtype": "number"},
            }
        }
        job.update_meta(preview=preview_data, items=0, fields=0, fields_names=[], fields_with_urls=[])

        ds.refresh_from_db()
        ret = ds.meta_file_serialization()

        assert ret == {
            "id": ds.id,
            "meta": {
                "name": ds.name,
                "description": None,
                "source": None,
                "source-url": None,
                "methodology": None,
                "updated": ds.modified.isoformat(),
                "creator": ds.created_by.get_full_name() if ds.created_by else "",
            },
            "type": ds.type,
            "file": ds.file.name,
            "google_sheet": ds.google_sheet,
            "shape": job.meta_data.shape,
            "result": job.result,
            "filters": [],
            "fields": {
                "0": {"name": "col_0", "type": "boolean"},
                "1": {"name": "col_1", "type": "boolean"},
                "2": {"name": "col_2", "type": "number"},
            },
            "views": [],
            "tags": [],
        }

    def test_add_tags(self, data_source, tag_category):
        tags_data = [
            {"category": tag_category.id, "value": "Test Tag 1"},
            {"category": tag_category.id, "value": "Test Tag 2"},
        ]

        data_source.add_tags(tags_data)

        assert data_source.tags.count() == 2

    def test_add_description(self, data_source):
        description_data = {
            "data": [
                {"key": "Name", "value": "Test Name"},
                {"key": "Surname", "value": "Test Surname"},
                {"key": "Age", "value": 30},
            ]
        }

        data_source.add_description(description_data)

        assert data_source.description.data == description_data["data"]


class TestDataSourceMeta:
    @pytest.mark.parametrize("offset, whence", [(0, 0), (0, 2)])  # test different file cursor positions
    def test_data(self, data_source_factory, offset, whence):
        preview_data = {"fields": {"test": {"dtype": "test_type"}}}

        ds = data_source_factory()
        ds.update_meta(preview=preview_data, items=0, fields=0, fields_names=[])

        ds.meta_data.refresh_from_db()
        expected = json.loads(ds.meta_data.preview.read())
        expected["labels"] = {"test": {"type": "test_type"}}
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
            ClientMethod="get_object",
            Params={
                **self._get_common_generate_presigned_url_params(settings, job),
                "VersionId": job.source_file_version,
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
            ClientMethod="get_object",
            Params={**self._get_common_generate_presigned_url_params(settings, job)},
        )

    @staticmethod
    def _get_common_generate_presigned_url_params(settings, job):
        filename = os.path.basename(job.source_file_path)
        return {
            "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
            "Key": job.source_file_path,
            "ResponseContentDisposition": f"attachment; filename={filename}",
        }
