import pytest

from schemacms.config.common import Common
from schemacms.datasources import serializers


pytestmark = [pytest.mark.django_db]


class TestStepSerializer:
    serializer_class = serializers.StepSerializer

    def test_instance_data(self, job_step_factory):
        step = job_step_factory()
        serializer = self.serializer_class(instance=step)

        assert serializer.data == {
            "script_name": step.script.name,
            "script": step.script_id,
            "body": step.body,
            "exec_order": step.exec_order,
            "options": step.options,
        }


class TestDataSourceJobSerializer:
    serializer_class = serializers.DataSourceJobSerializer

    def test_instance_data(self, job, job_step_factory, mocker, faker):
        mocker.patch("schemacms.datasources.models.DataSourceJob.source_file_url", faker.url())
        job_steps = job_step_factory.create_batch(2, datasource_job=job)
        serializer = self.serializer_class(instance=job)
        assert serializer.data == {
            "id": job.id,
            "datasource": job.datasource_id,
            "description": job.description,
            "steps": serializers.StepSerializer(instance=job_steps, many=True).data,
            "job_state": job.job_state,
            "result": job.result,
            "error": job.error,
            "source_file_url": job.source_file_url,
            "created": job.created.strftime(Common.REST_FRAMEWORK["DATETIME_FORMAT"]),
        }
