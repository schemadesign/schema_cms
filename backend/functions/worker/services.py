import boto3

import settings


s3 = boto3.client(
    's3',
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
)

s3_resource = boto3.resource(
    "s3",
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
)

secret_manager = boto3.client(
    "secretsmanager",
    endpoint_url=settings.SECRET_MANAGER_ENDPOINT_URL
)
