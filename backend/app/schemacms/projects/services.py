import json

import boto3
from django.utils import functional
from django.conf import settings


def get_s3():
    return boto3.client(
        's3',
        endpoint_url=settings.AWS_SQS_ENDPOINT_URL,
    )


def get_sqs():
    return boto3.client(
        'sqs',
        endpoint_url=settings.AWS_SQS_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


s3 = functional.SimpleLazyObject(get_s3)
sqs = functional.SimpleLazyObject(get_sqs)


def schedule_worker_with(datasource_job, source_file_size):
    queue_url = settings.SQS_WORKER_QUEUE_URL
    if source_file_size > settings.SQS_WORKER_QUEUE_FILE_SIZE:
        queue_url = settings.SQS_WORKER_EXT_QUEUE_URL
    sqs_response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(datasource_job.meta_file_serialization())
    )
    return sqs_response['MessageId']
