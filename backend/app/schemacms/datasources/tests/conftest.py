import pytest


@pytest.fixture()
def ds_source_file_latest_version_mock(mocker, faker):
    return mocker.patch(
        "schemacms.datasources.models.DataSource.source_file_latest_version",
        faker.uuid4(),
    )
