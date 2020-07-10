from urllib import parse

from aws_cdk.core import Stack, App, Duration, CfnOutput
from aws_cdk.aws_apigateway import LambdaRestApi
from aws_cdk.aws_s3 import Bucket, RedirectProtocol, RoutingRule, RoutingRuleCondition, ReplaceKey
from aws_cdk.aws_lambda import Function, Runtime, Code, Tracing

from config.base import EnvSettings


class ImageResizeStack(Stack):
    domain: str = None

    def __init__(self, scope: App, id: str, props: EnvSettings):
        super().__init__(scope, id)
        self.domain = props.domains.app

        (self.function, self.function_code, self.api_gateway,) = self.create_lambda()
        self.image_bucket = self.create_bucket(lambda_url=self.api_gateway.url)
        self.function.add_environment(key="BUCKET", value=self.image_bucket.bucket_name)
        self.function.add_environment(key="REDIRECT_URL", value=self.image_bucket.bucket_website_url)
        self.function.add_environment(key="CORS_ORIGIN", value=f"https://{self.domain}")
        self.function.add_environment(key="ALLOWED_DIMENSIONS", value="150x150,1024x1024")
        self.image_bucket.grant_read_write(self.function.role)

        if self.image_bucket.bucket_arn:
            CfnOutput(
                self,
                id="AppBucketOutput",
                export_name=self.get_image_resize_bucket_arn_output_export_name(),
                value=self.image_bucket.bucket_arn,
            )

    def create_bucket(self, lambda_url):
        parsed_url = parse.urlparse(lambda_url)
        protocol_mapping = {
            "HTTP": RedirectProtocol.HTTP,
            "HTTPS": RedirectProtocol.HTTPS,
        }
        return Bucket(
            self,
            "Images",
            public_read_access=True,
            website_index_document="index.html",
            website_routing_rules=[
                RoutingRule(
                    condition=RoutingRuleCondition(http_error_code_returned_equals="404"),
                    protocol=protocol_mapping[parsed_url.scheme.upper()],
                    host_name=parsed_url.netloc,
                    replace_key=ReplaceKey.prefix_with("prod/resize?key="),
                    http_redirect_code="307",
                )
            ],
        )

    def create_lambda(self):
        is_app_only = self.node.try_get_context("is_app_only")

        if is_app_only == "true":
            code = Code.from_asset(path="../backend/functions/image_resize/.serverless/main.zip")
        else:
            code = Code.from_cfn_parameters()

        function = Function(
            self,
            "image-resize-lambda",
            function_name="schema-cms-image-resize",
            code=code,
            handler="index.handler",
            runtime=Runtime.NODEJS_12_X,
            memory_size=512,
            timeout=Duration.seconds(30),
            tracing=Tracing.ACTIVE,
        )

        api_gateway = LambdaRestApi(
            self, "ImageResizeLambdaApi", rest_api_name="schema-cms-image-resize", handler=function
        )

        return function, code, api_gateway

    @staticmethod
    def get_image_resize_bucket_arn_output_export_name():
        return "schema-cms-imageResizeBucketArn"
