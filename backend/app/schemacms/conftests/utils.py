import csv
import io

import faker as faker_
import pytest
from rest_framework import test


@pytest.fixture()
def api_client():
    return test.APIClient()


@pytest.fixture()
def faker():
    return faker_.Faker()


def make_csv(cols_num=3, rows_num=1):
    csv_file = io.StringIO()
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow([f"col_{i}" for i in range(cols_num)])
    for i in range(rows_num):
        csv_writer.writerow([i for i in range(cols_num)])

    return csv_file
