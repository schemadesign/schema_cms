import io
import os
import zipfile

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


def scripts_upload_path(datasource):
    return settings.DS_SCRIPTS_UPLOAD_PATH.format(datasource.pk)


class ScriptResource:
    PROTOCOL = 'none'

    def ref_name(self, path):
        return ':'.join([self.PROTOCOL, path])

    def upload(self, path, uploaded_file):
        pass

    def getvalue(self, ref_key):
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
            for obj in self.bucket.objects.filter(Prefix=scripts_upload_path(datasource))
        ]

    def upload(self, obj, uploaded_file):
        return self.bucket.put_object(
            Key=os.path.join(scripts_upload_path(obj), uploaded_file.name), Body=uploaded_file
        )


class LocalScriptResource(ScriptResource):
    PROTOCOL = 'local'

    def __init__(self, path):
        self.path = path

    def list(self, datasource):
        for file in os.listdir(self.path):
            yield {'key': self.ref_name(file)}

    def getvalue(self, ref_key):
        with open(os.path.join(self.path, ref_key), 'r') as file:
            return file.read()


class Scripts:
    def __init__(self):
        self.resources = {}

    def list(self, datasource):
        listed = []
        for resource in self.resources.values():
            listed.extend(resource.list(datasource))
        return listed

    def responsible(self, file):
        protocol, ref_key = file.split(':')
        return next(filter(lambda r: r.PROTOCOL == protocol, self.resources.values()), None), ref_key


scripts = Scripts()

S3ScriptResource(settings.DATASOURCE_S3_BUCKET).register(scripts)
LocalScriptResource('./step-scripts/').register(scripts)


def schedule_worker_with(datasource_job):
    zip_stream = io.BytesIO()
    with zipfile.ZipFile(zip_stream, 'w') as zip_file:
        for step in datasource_job.steps:
            step_key = step['key']
            resource, ref_key = scripts.responsible(step_key)
            zip_file.writestr(ref_key, resource.getvalue())
    # s3.Bucket(settings.DATASOURCE_S3_BUCKET).
    # sqs.send_message(
    #     QueueUrl=settings.SQS_WORKER_QUEUE_URL,
    # )
