import json
import os

import boto3
from django.utils import functional
from django.conf import settings


def get_s3():
    return boto3.resource(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
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

    def __init__(self, bucket_name, upload_path):
        self.bucket = s3.Bucket(bucket_name)
        self.upload_path = upload_path

    def get_upload_path(self, datasource):
        return self.upload_path.format(datasource.pk)

    def list(self, obj):
        return [
            {'key': self.ref_name(obj.key), 'resource': self, 'ref_key': obj.key}
            for obj in self.bucket.objects.filter(Prefix=self.get_upload_path(obj))
        ]

    def upload(self, obj, uploaded_file):
        return self.bucket.put_object(
            Key=os.path.join(self.get_upload_path(obj), uploaded_file.name), Body=uploaded_file
        )

    def getvalue(self, ref_key):
        response = self.bucket.get_object(Key=ref_key)
        return response['Body'].read()


class LocalScriptResource(ScriptResource):
    PROTOCOL = 'local'

    def __init__(self, path):
        self.path = path

    def list(self, datasource):
        for file in os.listdir(self.path):
            yield {'key': self.ref_name(file), 'resource': self, 'ref_key': file}

    def getvalue(self, ref_key):
        file_path = os.path.join(self.path, ref_key)
        if not os.path.isfile(file_path):
            raise RuntimeError(f'File does not exist {ref_key}')

        with open(file_path, 'r') as file:
            return file.read()


class Scripts:
    def __init__(self):
        self.resources = {}

    def list(self, datasource):
        listed = []
        for resource in self.resources.values():
            listed.extend(resource.list(datasource))
        return listed

    def responsible(self, key):
        protocol, ref_key = key.split(':')
        return next(filter(lambda r: r.PROTOCOL == protocol, self.resources.values()), None), ref_key


def setup_scripts():
    scripts_ = Scripts()
    S3ScriptResource(settings.DATASOURCE_S3_BUCKET, settings.DS_SCRIPTS_UPLOAD_PATH).register(scripts_)
    LocalScriptResource('./step-scripts/').register(scripts_)
    return scripts_


scripts = functional.SimpleLazyObject(setup_scripts)


def schedule_worker_with(datasource_job):
    sqs_response = sqs.send_message(
        QueueUrl=settings.SQS_WORKER_QUEUE_URL, MessageBody=json.dumps({'job_pk': datasource_job.pk})
    )
    return sqs_response['MessageId']
