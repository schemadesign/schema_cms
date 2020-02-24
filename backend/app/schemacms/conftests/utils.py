import faker as faker_
import pytest
from django.core.files import storage
from django.conf import settings
from rest_framework import test

from schemacms.utils import test as utils_test


@pytest.fixture(autouse=True, scope="session")
def configure_test_settings():
    if "silk.middleware.SilkyMiddleware" in settings.MIDDLEWARE:
        settings.MIDDLEWARE.remove("silk.middleware.SilkyMiddleware")


@pytest.fixture()
def api_client():
    return test.APIClient()


@pytest.fixture()
def faker():
    fake = faker_.Faker()
    fake.add_provider(utils_test.CSVProvider)
    fake.add_provider(utils_test.PythonScriptProvider)
    fake.add_provider(utils_test.ImageProvider)
    return fake


@pytest.fixture()
def transaction_on_commit(mocker):
    """Call function without db commit"""
    mocker.patch("django.db.transaction.on_commit", lambda fn: fn())


@pytest.fixture()
def fake_job_schedule(mocker):
    mocker.patch("schemacms.projects.models.DataSourceJob.schedule")


@pytest.fixture()
def create_fake_job(mocker):
    mocker.patch("schemacms.projects.models.DataSource.create_job")


@pytest.fixture()
def default_storage():
    return storage.default_storage
