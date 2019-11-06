import dataclasses
import functools

import uuid

import pytest


@dataclasses.dataclass
class ObjectVersion:
    object_key: str
    bucket_name: str = "test_bucket"
    id: str = dataclasses.field(default=lambda: uuid.uuid4().hex)
    is_latest: bool = False


@pytest.fixture()
def s3_object_version_factory():
    return ObjectVersion


@pytest.fixture()
def s3(mocker):
    s3_mock = _boto_client_mock_factory(mocker, "s3")
    mocker.patch("boto3.client", return_value=s3_mock)
    return s3_mock


@functools.lru_cache()
def _boto_client_mock_factory(mocker, service):
    return mocker.Mock()
