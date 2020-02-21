import logging
import os
import sys

import boto3


FUNCTION_NAME = "worker"

try:
    client = boto3.client("lambda", endpoint_url=os.getenv("LAMBDA_ENDPOINT_URL", "http://localstack:4574"))

    with open("/functions/worker/.serverless/main.zip", 'rb') as f:
        zipped_code = f.read()

    envs = {
        "AWS_STORAGE_BUCKET_NAME": os.getenv("AWS_STORAGE_BUCKET_NAME", "schemacms"),
        "IMAGE_SCRAPING_FETCH_TIMEOUT": "15",
        "AWS_IMAGE_STORAGE_BUCKET_NAME": "schemacms-images",
        "AWS_IMAGE_STATIC_URL": "http://localhost:4572/schemacms-images",
        "AWS_ACCESS_KEY_ID": "foo",
        "AWS_SECRET_ACCESS_KEY": "bar",
        "AWS_DEFAULT_REGION": "us-east-1",
        "BACKEND_URL": "http://172.17.0.1:8000/api/v1",
        # "BACKEND_URL": "http://host.docker.internal:8000/api/v1",
        "LAMBDA_AUTH_TOKEN": os.getenv("LAMBDA_AUTH_TOKEN"),
    }

    client.create_function(
        FunctionName=FUNCTION_NAME,
        Runtime='python3.8',
        Role="role",
        Handler="handler.main",
        Code=dict(ZipFile=zipped_code),
        Environment={'Variables': envs},
    )

    client.create_event_source_mapping(
        EventSourceArn="arn:aws:sqs:us-east-1:000000000000:schemacms-queue", FunctionName=FUNCTION_NAME
    )

except Exception as e:
    logging.error(f"{e}")
    sys.exit(1)
