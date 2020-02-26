import json
import logging

import boto3
import botocore
from django.utils import functional
from django.conf import settings

from schemacms.projects import constants


def get_s3():
    return boto3.client("s3", endpoint_url=settings.AWS_S3_ENDPOINT_URL)


def get_dynamodb_resource():
    return boto3.resource(
        "dynamodb",
        endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def get_dynamodb_client():
    return boto3.client(
        "dynamodb",
        endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def get_sqs():
    return boto3.client(
        "sqs",
        endpoint_url=settings.AWS_SQS_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


s3 = functional.SimpleLazyObject(get_s3)
sqs = functional.SimpleLazyObject(get_sqs)
dynamo = functional.SimpleLazyObject(get_dynamodb_resource)


def local_lambda_invoke(payload):
    data = {
        "Records": [
            {
                "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
                "receiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
                "body": json.dumps(payload),
                "attributes": {
                    "ApproximateReceiveCount": "1",
                    "SentTimestamp": "1545082649183",
                    "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                    "ApproximateFirstReceiveTimestamp": "1545082649185",
                },
                "messageAttributes": {},
                "md5OfBody": "098f6bcd4621d373cade4e832627b4f6",
                "eventSource": "aws:sqs",
                "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
                "awsRegion": "us-east-2",
            }
        ]
    }
    lambda_client = boto3.client(
        "lambda",
        endpoint_url="http://workerlambda:9001",
        use_ssl=False,
        verify=False,
        config=botocore.client.Config(
            signature_version=botocore.UNSIGNED, read_timeout=30, retries={"max_attempts": 0},
        ),
    )
    response = lambda_client.invoke(FunctionName="main", InvocationType="Event", Payload=json.dumps(data))

    return response


def get_sqs_queue_url(file_size: int) -> str:
    """Return queue url based on input file size"""
    if file_size < settings.BASE_QUEUE_LIMIT:
        return settings.SQS_WORKER_QUEUE_URL
    elif file_size < settings.EXT_QUEUE_LIMIT:
        return settings.SQS_WORKER_EXT_QUEUE_URL
    else:
        return settings.SQS_WORKER_MAX_QUEUE_URL


def schedule_worker_with(data: dict, source_file_size: int):
    if settings.LOCAL_LAMBDA:
        return local_lambda_invoke(data)

    queue_url = get_sqs_queue_url(file_size=source_file_size)
    sqs_response = sqs.send_message(QueueUrl=queue_url, MessageBody=json.dumps(data))
    return sqs_response["MessageId"]


def schedule_object_meta_processing(obj, source_file_size, copy_steps):
    data = {
        "type": obj.meta_file_processing_type,
        "data": obj.meta_file_serialization(),
        "copy_steps": copy_steps,
    }

    try:
        message_id = schedule_worker_with(data=data, source_file_size=source_file_size)
    except Exception as e:
        obj.meta_data.status = constants.ProcessingState.FAILED
        obj.meta_data.save(update_fields=["status"])
        return logging.error(f"Scheduling *DataSource Update Meta fail - {e}")

    return message_id


def schedule_job_scripts_processing(datasource_job, source_file_size):
    data = {
        "type": constants.WorkerProcessType.SCRIPTS_PROCESSING,
        "data": datasource_job.meta_file_serialization(),
    }
    return schedule_worker_with(data=data, source_file_size=source_file_size)
