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
