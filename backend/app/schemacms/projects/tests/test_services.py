import json

import pytest

from schemacms.projects import constants, services


pytestmark = [pytest.mark.django_db]


class TestScheduleJobScriptsProcessingWith:
    @pytest.mark.parametrize(
        "file_size, expected_queue_idx",
        [
            (10485760, 0),  # 10MB
            (52428800, 0),  # 50MB
            (104857600, 1),  # 100MB
            (157286400, 1),  # 150MB
            (209715200, 1),  # 200MB
        ],
    )
    def test_call(self, settings, job, file_size, expected_queue_idx, sqs):
        queues = [settings.SQS_WORKER_QUEUE_URL, settings.SQS_WORKER_EXT_QUEUE_URL]
        expected_queue_url = queues[expected_queue_idx]
        settings.SQS_WORKER_QUEUE_FILE_SIZE = 52428800  # 50mb
        data = {"type": constants.WorkerProcessType.SCRIPTS_PROCESSING, "data": job.meta_file_serialization()}

        services.schedule_job_scripts_processing(job, file_size)

        sqs.send_message.assert_called_with(QueueUrl=expected_queue_url, MessageBody=json.dumps(data))
