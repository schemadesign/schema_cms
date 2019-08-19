import faker as faker_
import pytest
from rest_framework import test


@pytest.fixture()
def api_client():
    return test.APIClient()


@pytest.fixture()
def faker():
    return faker_.Faker()

