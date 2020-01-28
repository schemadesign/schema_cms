import json

import boto3

from . import settings, utils


s3 = boto3.client('s3', endpoint_url=settings.AWS_S3_ENDPOINT_URL,)

s3_resource = boto3.resource("s3", endpoint_url=settings.AWS_S3_ENDPOINT_URL,)

secret_manager = boto3.client("secretsmanager", endpoint_url=settings.SECRET_MANAGER_ENDPOINT_URL)

dynamodb = boto3.resource("dynamodb", endpoint_url=settings.DYNAMODB_ENDPOINT_URL)


def get_s3_object(path, version=None):
    params = dict(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=path)
    if version:
        params["VersionId"] = version
    return s3.get_object(**params)


def get_dynamo_item(table, item_id):
    table = dynamodb.Table(table)
    response = table.get_item(Key={"id": item_id})

    try:
        item = json.dumps(response["Item"], cls=utils.DecimalEncoder)
    except KeyError:
        raise Exception(f"Item with ID {item_id} does not exist")

    return item
