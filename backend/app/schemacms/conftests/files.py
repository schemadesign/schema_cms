import django.core.files.storage
import pytest


@pytest.fixture(autouse=True)
def default_storage():
    default_storage = django.core.files.storage.default_storage
    try:
        yield default_storage
    finally:
        default_storage.close_all()
