import faker as faker_
import pytest
from rest_framework import test

from schemacms.utils import test as utils_test


@pytest.fixture()
def api_client():
    return test.APIClient()


@pytest.fixture()
def faker():
    fake = faker_.Faker()
    fake.add_provider(utils_test.CSVProvider)
    fake.add_provider(utils_test.PythonScriptProvider)
    return fake
