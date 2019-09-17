import os

import boto3
from django.conf import settings

s3 = boto3.resource(
    's3',
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

sqs = boto3.client(
    'sqs',
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


def upload_path(datasource):
    return settings.SCRIPTS_DS_UPLOAD_PATH.format(datasource.pk)


class ScriptResource:
    PROTOCOL = 'none'

    def ref_name(self, path):
        return ':'.join([self.PROTOCOL, path])

    def upload(self, path, uploaded_file):
        pass

    def register(self, scripts_storage):
        scripts_storage.resources[self.PROTOCOL] = self


class S3ScriptResource(ScriptResource):
    PROTOCOL = 's3'

    def __init__(self, bucket_name):
        self.bucket = s3.Bucket(bucket_name)

    def list(self, datasource):
        return [
            {'key': self.ref_name(obj.key)}
            for obj in self.bucket.objects.filter(Prefix=upload_path(datasource))
        ]

    def upload(self, obj, uploaded_file):
        return self.bucket.put_object(
            Key=os.path.join(upload_path(obj), uploaded_file.name), Body=uploaded_file
        )


class LocalScriptResource(ScriptResource):
    PROTOCOL = 'local'

    def __init__(self, path):
        self.path = path

    def list(self, datasource):
        for file in os.listdir(self.path):
            yield {'key': self.ref_name(file)}


class Scripts:
    def __init__(self, resources=None):
        self.resources = resources if resources else {}

    def list(self, datasource):
        listed = []
        for resource in self.resources.values():
            listed.extend(resource.list(datasource))
        return listed

    def responsible(self, file):
        protocol, *_ = file.split(':')
        return next(filter(lambda r: r.PROTOCOL == protocol, self.resources.values()), None)


scripts = Scripts()

S3ScriptResource(settings.SCRIPTS_S3_BUCKET).register(scripts)
LocalScriptResource('./step-scripts/').register(scripts)
