from typing import List

from aws_cdk.aws_s3 import Bucket
from aws_cdk.core import App, Stack, Duration, Fn
from aws_cdk.aws_lambda import Code, Function, Runtime, Tracing
from aws_cdk.aws_lambda_event_sources import SqsEventSource
from aws_cdk.aws_secretsmanager import Secret
from aws_cdk.aws_sqs import Queue

from config.base import EnvSettings
from stacks.services.api.stack import ApiStack
from stacks.services.image_resize.stack import ImageResizeStack


class LambdaWorkerStack(Stack):
    app_bucket: Bucket = None
    resize_lambda_image_bucket: Bucket = None
    backend_url: str = ""
    lambda_auth_token: Secret = None
    functions: List[Function] = None
    sentry_dns: Secret = None

    def __init__(self, scope: App, id: str, props: EnvSettings, queues: List[Queue]):
        super().__init__(scope, id)

        self.backend_url = f"https://{props.domains.api}/api/v1/"
        self.app_bucket = Bucket.from_bucket_arn(
            self, id="App", bucket_arn=Fn.import_value(ApiStack.get_app_bucket_arn_output_export_name())
        )
        self.resize_lambda_image_bucket = Bucket.from_bucket_arn(
            self,
            id="Images",
            bucket_arn=Fn.import_value(ImageResizeStack.get_image_resize_bucket_arn_output_export_name()),
        )

        self.sentry_dns = Secret.from_secret_arn(self, id="sentry-dns", secret_arn=props.arns["sentry_dns"])
        self.lambda_auth_token = Secret.from_secret_arn(
            self, id="lambda-auth-token", secret_arn=props.arns["lambda_auth_token"]
        )

        self.functions = [
            self._create_lambda_fn(memory_size=memory_size, queue=queue)
            for memory_size, queue in zip(props.lambdas_sizes, queues)
        ]

    def _create_lambda_fn(self, memory_size: int, queue: Queue):
        code = Code.from_asset(path="../backend/functions/worker/.serverless/main.zip")

        function = Function(
            self,
            f"data-processing-worker-{memory_size}",
            function_name=f"schema-cms-data-processing-{memory_size}",
            code=code,
            runtime=Runtime.PYTHON_3_8,
            handler="handler.main",
            environment={
                "AWS_STORAGE_BUCKET_NAME": self.app_bucket.bucket_name,
                "IMAGE_SCRAPING_FETCH_TIMEOUT": "15",
                "AWS_IMAGE_STORAGE_BUCKET_NAME": self.resize_lambda_image_bucket.bucket_name,
                "AWS_IMAGE_STATIC_URL": self.resize_lambda_image_bucket.bucket_website_url,
                "BACKEND_URL": self.backend_url,
                "SENTRY_DNS": self.sentry_dns.secret_value.to_string(),
                "LAMBDA_AUTH_TOKEN": self.lambda_auth_token.secret_value.to_string(),
            },
            memory_size=memory_size,
            timeout=Duration.seconds(300),
            tracing=Tracing.ACTIVE,
        )

        function.add_event_source(SqsEventSource(queue, batch_size=1))

        self.app_bucket.grant_read_write(function.role)
        self.resize_lambda_image_bucket.grant_read_write(function.role)

        return function, code
