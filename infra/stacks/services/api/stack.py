from typing import List

from aws_cdk.aws_certificatemanager import Certificate
from aws_cdk.aws_ec2 import Port, Vpc
from aws_cdk.aws_ecr import Repository
from aws_cdk.aws_ecs import ContainerImage, Cluster, AwsLogDriver, Secret as EcsSecret
from aws_cdk.aws_ecs_patterns import (
    ApplicationLoadBalancedTaskImageOptions,
    ApplicationLoadBalancedFargateService,
)
from aws_cdk.aws_iam import PolicyStatement
from aws_cdk.aws_rds import DatabaseInstance
from aws_cdk.aws_route53 import PrivateHostedZone
from aws_cdk.aws_s3 import Bucket
from aws_cdk.aws_secretsmanager import Secret
from aws_cdk.aws_sqs import Queue
from aws_cdk.core import App, Stack, Fn, CfnOutput

from config.base import EnvSettings
from stacks.base.resources.ecr import BaseECR
from stacks.base.resources.kms import BaseKMS
from stacks.base.resources.resources import BaseResources


class ApiStack(Stack):
    job_processing_queues: List[Queue] = None
    app_bucket: Bucket = None
    pages_bucket: Bucket = None
    domain_name: str = ""

    def __init__(
        self, scope: App, id: str, props: EnvSettings, queues: List[Queue], vpc: Vpc, db: DatabaseInstance
    ):
        super().__init__(scope, id)

        self.db_secret_arn = Fn.import_value(BaseResources.get_database_secret_arn_output_export_name())

        self.job_processing_queues = queues

        self.app_bucket = Bucket(self, "App", versioned=True)

        if self.app_bucket.bucket_arn:
            CfnOutput(
                self,
                id="AppBucketOutput",
                export_name=self.get_app_bucket_arn_output_export_name(),
                value=self.app_bucket.bucket_arn,
            )

        self.pages_bucket = Bucket(self, "Pages", public_read_access=True)

        self.domain_name = props.domains.api

        django_secret = Secret(self, "DjangoSecretKey", secret_name="SCHEMA_CMS_DJANGO_SECRET_KEY")
        lambda_auth_token_secret = Secret(self, "LambdaAuthToken", secret_name="SCHEMA_CMS_LAMBDA_AUTH_TOKEN")

        if lambda_auth_token_secret.secret_arn:
            CfnOutput(
                self,
                id="lambdaAuthTokenArnOutput",
                export_name=self.get_lambda_auth_token_arn_output_export_name(),
                value=lambda_auth_token_secret.secret_arn
            )

        self.django_secret_key = EcsSecret.from_secrets_manager(django_secret)
        self.lambda_auth_token = EcsSecret.from_secrets_manager(lambda_auth_token_secret)

        tag_from_context = self.node.try_get_context("app_image_tag")
        tag = tag_from_context if tag_from_context != "undefined" else None

        api_image = ContainerImage.from_ecr_repository(
            repository=Repository.from_repository_name(
                self, id="BackendRepository", repository_name=BaseECR.get_backend_repository_name()
            ),
            tag=tag
        )
        nginx_image = ContainerImage.from_ecr_repository(
            repository=Repository.from_repository_name(
                self, id="NginxRepository", repository_name=BaseECR.get_nginx_repository_name()
            ), tag=tag
        )

        self.api = ApplicationLoadBalancedFargateService(
            self,
            "ApiService",
            service_name="schema-cms-api-service",
            cluster=Cluster.from_cluster_attributes(
                self, id="WorkersCluster", cluster_name="schema-ecs-cluster", vpc=vpc, security_groups=[],
            ),
            task_image_options=ApplicationLoadBalancedTaskImageOptions(
                image=nginx_image, container_name="nginx", container_port=80, enable_logging=True,
            ),
            desired_count=1,
            cpu=512,
            memory_limit_mib=1024,
            certificate=Certificate.from_certificate_arn(self, "Cert", certificate_arn=props.certificate_arn),
            domain_name=self.domain_name,
            domain_zone=PrivateHostedZone(self, "zone", vpc=vpc, zone_name=self.domain_name,),
        )

        self.api.task_definition.add_container(
            "backend",
            image=api_image,
            command=["sh", "-c", "/bin/chamber exec $CHAMBER_SERVICE_NAME -- ./scripts/run.sh"],
            logging=AwsLogDriver(stream_prefix="backend-container"),
            environment={
                "POSTGRES_DB": props.data_base_name,
                "AWS_STORAGE_BUCKET_NAME": self.app_bucket.bucket_name,
                "AWS_STORAGE_PAGES_BUCKET_NAME": self.pages_bucket.bucket_name,
                "SQS_WORKER_QUEUE_URL": self.job_processing_queues[0].queue_url,
                "SQS_WORKER_EXT_QUEUE_URL": self.job_processing_queues[1].queue_url,
                "SQS_WORKER_MAX_QUEUE_URL": self.job_processing_queues[2].queue_url,
                "DJANGO_HOST": f"https://{props.domains.api}",
                "DJANGO_WEBAPP_HOST": f"https://{props.domains.webapp}",
                "PUBLIC_API_URL": f"https://{props.domains.public_api}/",
                "CHAMBER_SERVICE_NAME": "schema-cms-app",
                "CHAMBER_KMS_KEY_ALIAS": "schema-cms",
            },
            secrets={
                "DB_CONNECTION": EcsSecret.from_secrets_manager(
                    Secret.from_secret_arn(self, id="DbSecret", secret_arn=self.db_secret_arn)
                ),
                "DJANGO_SECRET_KEY": self.django_secret_key,
                "LAMBDA_AUTH_TOKEN": self.lambda_auth_token
            },
            cpu=512,
            memory_limit_mib=1024,
        )

        self.django_secret_key.grant_read(self.api.service.task_definition.task_role)

        self.app_bucket.grant_read_write(self.api.service.task_definition.task_role)
        self.pages_bucket.grant_read_write(self.api.service.task_definition.task_role)

        for queue in self.job_processing_queues:
            queue.grant_send_messages(self.api.service.task_definition.task_role)

        self.api.service.connections.allow_to(db.connections, Port.tcp(5432))
        self.api.task_definition.add_to_task_role_policy(
            PolicyStatement(actions=["ses:SendRawEmail", "ses:SendBulkTemplatedEmail"], resources=["*"],)
        )

        self.api.task_definition.add_to_task_role_policy(
            PolicyStatement(
                actions=["kms:Get*", "kms:Describe*", "kms:List*", "kms:Decrypt"],
                resources=[Fn.import_value(BaseKMS.get_kms_arn_output_export_name())],
            )
        )

        self.api.task_definition.add_to_task_role_policy(
            PolicyStatement(actions=["ssm:DescribeParameters"], resources=["*"])
        )

        self.api.task_definition.add_to_task_role_policy(
            PolicyStatement(
                actions=["ssm:GetParameters*"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/schema-cms-app/*"],
            )
        )

    def grant_secret_access(self, secret):
        secret.grant_read(self.api.service.task_definition.task_role)

    @staticmethod
    def get_app_bucket_arn_output_export_name():
        return "schema-cms-appBucketArn"

    @staticmethod
    def get_lambda_auth_token_arn_output_export_name():
        return "schema-cms-lambdaAuthTokenArn"
