import json

import boto3
from django.utils import functional
from django.conf import settings

from schemacms.projects import constants


def get_s3():
    return boto3.client('s3', endpoint_url=settings.AWS_S3_ENDPOINT_URL)


def get_sqs():
    return boto3.client(
        'sqs',
        endpoint_url=settings.AWS_SQS_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


s3 = functional.SimpleLazyObject(get_s3)
sqs = functional.SimpleLazyObject(get_sqs)


def get_sqs_queue_url(file_size: int) -> str:
    """Return queue url based on input file size"""
    if file_size > settings.SQS_WORKER_QUEUE_FILE_SIZE:
        return settings.SQS_WORKER_EXT_QUEUE_URL
    return settings.SQS_WORKER_QUEUE_URL


def schedule_worker_with(data: dict, source_file_size: int):
    queue_url = get_sqs_queue_url(file_size=source_file_size)
    sqs_response = sqs.send_message(
        QueueUrl=queue_url, MessageBody=json.dumps(data)
    )
    return sqs_response['MessageId']


def schedule_object_meta_processing(obj, source_file_size):
    data = {
        "type": constants.WorkerProcessType.META_PROCESSING,
        "objType": obj.__class__.__name__,
        "data": obj.meta_file_serialization(),
    }
    return schedule_worker_with(data=data, source_file_size=source_file_size)


def schedule_job_scripts_processing(datasource_job, source_file_size):
    data = {
        "type": constants.WorkerProcessType.SCRIPTS_PROCESSING,
        "data": datasource_job.meta_file_serialization(),
    }
    return schedule_worker_with(data=data, source_file_size=source_file_size)
