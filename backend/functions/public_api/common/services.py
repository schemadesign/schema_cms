import boto3

from . import settings


s3 = boto3.client("s3", endpoint_url=settings.AWS_S3_ENDPOINT_URL,)

s3_resource = boto3.resource("s3", endpoint_url=settings.AWS_S3_ENDPOINT_URL,)


def get_s3_object(path, version=None):
    params = dict(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=path)
    if version:
        params["VersionId"] = version
    return s3.get_object(**params)
