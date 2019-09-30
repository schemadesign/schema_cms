import os
import json

import pytest
from django.conf import settings
from factory.django import FileField
from pandas import read_csv

from schemacms.utils.test import make_csv
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
        correct_path = os.path.join(
            base_path,
            f"{settings.STORAGE_DIR}/projects",
            f"{dsource.project_id}/datasources/{dsource.id}/{filename}",
        )

        assert correct_path == dsource.file.path

    def test_creating_meta(self):
        filename = "file_path_test.csv"
        dsource = self.create_dsource(filename)

        dsource.ready_for_processing()
        dsource.process()

        items, fields = read_csv(dsource.file.path).shape
        assert dsource.meta_data.fields == fields
        assert dsource.meta_data.items == items

    def test_updating_meta(self, data_source):
        cols_number = 4
        rows_number = 3
        new_file = make_csv(cols_number, rows_number)

        old_preview = data_source.meta_data.preview

        data_source.file.save("new_file.csv", new_file)
        data_source.refresh_from_db()
        data_source.ready_for_processing()
        data_source.process()

        assert data_source.meta_data.fields == cols_number
        assert data_source.meta_data.items == rows_number
        assert data_source.meta_data.preview != old_preview

    def test_get_preview(self, data_source):
        source_file = read_csv(data_source.file.path)

        preview, fields_info = data_source.get_preview_data(source_file)

        expected_preview = json.loads(source_file.head(5).to_json(orient="records"))
        expected_fields_info = json.loads(
            source_file.describe(include="all", percentiles=[]).to_json(orient="columns")
        )
        expected_samples = json.loads(source_file.sample(n=1).to_json(orient="records"))

        for key, value in dict(source_file.dtypes).items():
            expected_fields_info[key]["dtype"] = "string" if value.name == "object" else value.name

        for key, value in expected_samples[0].items():
            expected_fields_info[key]["sample"] = value

        assert expected_preview == preview
        assert expected_fields_info == fields_info


class TestDataSourceMeta:
    @pytest.mark.parametrize("offset, whence", [(0, 0), (0, 2)])  # test different file cursor positions
    def test_data(self, data_source_meta, offset, whence):
        expected = json.loads(data_source_meta.preview.read())
        data_source_meta.preview.seek(offset, whence)

        assert data_source_meta.data == expected
