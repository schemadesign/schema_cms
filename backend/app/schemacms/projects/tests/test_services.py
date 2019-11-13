import json

import pytest

from schemacms.projects import services


pytestmark = [pytest.mark.django_db]


class TestScheduleWorkerWith:
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
    def test_call(self, mocker, settings, job, file_size, expected_queue_idx):
        queues = [settings.SQS_WORKER_QUEUE_URL, settings.SQS_WORKER_EXT_QUEUE_URL]
        expected_queue_url = queues[expected_queue_idx]
        settings.SQS_WORKER_QUEUE_FILE_SIZE = 52428800  # 50mb
        send_message_mock = mocker.patch("schemacms.projects.services.sqs.send_message")

        services.schedule_worker_with(job, file_size)

        send_message_mock.assert_called_with(
            QueueUrl=expected_queue_url, MessageBody=json.dumps(job.meta_file_serialization())
        )
