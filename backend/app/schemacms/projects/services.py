import json

import boto3
from django.utils import functional
from django.conf import settings


def get_sqs():
    return boto3.client(
        'sqs',
        endpoint_url=settings.AWS_SQS_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


sqs = functional.SimpleLazyObject(get_sqs)


def schedule_worker_with(datasource_job):
    sqs_response = sqs.send_message(
        QueueUrl=settings.SQS_WORKER_QUEUE_URL, MessageBody=json.dumps({'job_pk': datasource_job.pk})
    )
    return sqs_response['MessageId']
