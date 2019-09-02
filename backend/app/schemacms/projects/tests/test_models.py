import os
import json

import pytest
from factory.django import FileField
from pandas import read_csv

from schemacms.conftests.utils import make_csv
from schemacms.projects.tests.factories import DataSourceFactory


pytestmark = [pytest.mark.django_db]


class TestDataSourceModelMethods:
    """
    Tests DataSource model additional methods
    """
    @staticmethod
    def create_dsource(filename):
        return DataSourceFactory.create(
            name='Test Data Source',
            file=FileField(filename=filename, data=make_csv().getvalue())
        )

    def test_file_path(self):
        filename = 'file_path_test.csv'
        dsource = self.create_dsource(filename)

        base_path = dsource.file.storage.location
        correct_path = os.path.join(
            base_path,
            f"{os.getenv('STORAGE_DIR')}/projects",
            f"{dsource.project_id}/datasources/{dsource.id}/{filename}"
        )

        assert correct_path == dsource.file.path

    def test_creating_meta(self):
        filename = 'file_path_test.csv'
        dsource = self.create_dsource(filename)

        items, fields = read_csv(dsource.file.path).shape

        assert dsource.meta_data.fields == fields
        assert dsource.meta_data.items == items

    def test_updating_meta(self, datasource):
        cols_number = 4
        rows_number = 3
        new_file = make_csv(cols_number, rows_number)

        datasource.file.save('new_file.csv', new_file)
        datasource.refresh_from_db()

        assert datasource.meta_data.fields == cols_number
        assert datasource.meta_data.items == rows_number

    def test_get_preview(self, datasource):
        source_file = read_csv(datasource.file.path)

        preview, fields_info = datasource.get_preview_data()

        expected_preview = json.loads(source_file.head(5).to_json(orient='records'))
        expected_fields_info = json.loads(source_file.describe(
            include='all',
            percentiles=[]
        ).to_json(orient='columns'))

        for key, value in dict(source_file.dtypes).items():
            expected_fields_info[key]["dtype"] = value.name

        assert expected_preview == preview
        assert expected_fields_info == fields_info
