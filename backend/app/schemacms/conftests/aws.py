import dataclasses
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
    return mocker.patch("schemacms.utils.services.s3")


@pytest.fixture()
def sqs(mocker):
    return mocker.patch("schemacms.utils.services.sqs")


@pytest.fixture(autouse=True)
def create_dynamo_item(mocker):
    mocker.patch("schemacms.utils.models.MetaGeneratorMixin.create_dynamo_item")


@pytest.fixture(autouse=True)
def delete_dynamo_item(mocker):
    mocker.patch("schemacms.utils.models.MetaGeneratorMixin.delete_dynamo_item")
