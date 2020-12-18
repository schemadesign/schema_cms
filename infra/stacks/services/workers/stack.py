from typing import List, Tuple

from aws_cdk.aws_lambda import Code, Function, Runtime, Tracing
from aws_cdk.aws_lambda_event_sources import SqsEventSource
from aws_cdk.aws_s3 import Bucket
from aws_cdk.aws_secretsmanager import Secret
from aws_cdk.aws_sqs import Queue
from aws_cdk.aws_ssm import StringParameter
from aws_cdk.core import App, Stack, Duration, Fn
from config.base import EnvSettings
from stacks.components.stack import ComponentsStack
from stacks.services.api.stack import ApiStack
from stacks.services.image_resize.stack import ImageResizeStack


class LambdaWorkerStack(Stack):
    job_processing_queues: List[Queue] = None
    app_bucket: Bucket = None
    resize_lambda_image_bucket: Bucket = None
    backend_url: str = ""
    lambda_auth_token: Secret = None
    functions: List[Tuple[Function, Code]] = None

    def __init__(self, scope: App, id: str, envs: EnvSettings, components: ComponentsStack):
        super().__init__(scope, id)

        self.backend_domain_name = StringParameter.from_string_parameter_name(
            self, "DomainNameParameter", string_parameter_name="/schema-cms-app/DOMAIN_NAME"
        ).string_value

        self.backend_url = f"https://{self.backend_domain_name}/api/v1/"

        self.job_processing_queues = components.data_processing_queues

        self.app_bucket = Bucket.from_bucket_arn(
            self, id="App", bucket_arn=Fn.import_value(ApiStack.get_app_bucket_arn_output_export_name(envs))
        )
        self.resize_lambda_image_bucket = Bucket.from_bucket_arn(
            self,
            id="Images",
            bucket_arn=Fn.import_value(ImageResizeStack.get_image_resize_bucket_arn_output_export_name(envs)),
        )

        self.lambda_auth_token = Secret.from_secret_arn(
            self,
            id="lambda-auth-token",
            secret_arn=Fn.import_value(ApiStack.get_lambda_auth_token_arn_output_export_name(envs)),
        )

        self.functions = [
            self._create_lambda_fn(envs, memory_size, queue)
            for memory_size, queue in zip(envs.lambdas_sizes, self.job_processing_queues)
        ]

    def _create_lambda_fn(self, envs: EnvSettings, memory_size: int, queue: Queue):
        is_app_only = self.node.try_get_context("is_app_only")

        if is_app_only == "true":
            code = Code.from_asset(path="../backend/functions/worker/.serverless/main.zip")
        else:
            code = Code.from_cfn_parameters()

        function = Function(
            self,
            f"data-processing-worker-{memory_size}",
            function_name=f"{envs.project_name}-data-processing-{memory_size}",
            code=code,
            runtime=Runtime.PYTHON_3_8,
            handler="handler.main",
            environment={
                "AWS_STORAGE_BUCKET_NAME": self.app_bucket.bucket_name,
                "IMAGE_SCRAPING_FETCH_TIMEOUT": "15",
                "AWS_IMAGE_STORAGE_BUCKET_NAME": self.resize_lambda_image_bucket.bucket_name,
                "AWS_IMAGE_STATIC_URL": self.resize_lambda_image_bucket.bucket_website_url,
                "BACKEND_URL": self.backend_url,
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
