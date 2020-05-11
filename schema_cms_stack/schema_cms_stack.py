from urllib import parse

from aws_cdk import (
    core,
    aws_s3,
    aws_ec2,
    aws_sqs,
    aws_apigateway,
    aws_lambda,
    aws_lambda_event_sources,
    aws_ecs,
    aws_ecs_patterns,
    aws_iam,
    aws_rds,
    aws_secretsmanager,
    aws_codebuild,
    aws_ecr,
    aws_codepipeline,
    aws_codepipeline_actions,
    aws_certificatemanager,
    aws_route53,
)


DB_NAME = "gistdb"
APP_S3_BUCKET_NAME = "schemacms"
IMAGE_S3_BUCKET_NAME = "schemacms-images"
PAGES_S3_BUCKET_NAME = "schemacms-pages"
LAMBDA_AUTH_TOKEN_ENV_NAME = "LAMBDA_AUTH_TOKEN"
JOB_PROCESSING_MAX_RETRIES = 3
JOB_PROCESSING_MEMORY_SIZES = [512, 1280, 3008]

INSTALLATION_MODE_CONTEXT_KEY = "installation_mode"
DOMAIN_NAME_CONTEXT_KEY = "domain_name"

INSTALLATION_MODE_FULL = "full"
INSTALLATION_MODEL_APP_ONLY = "app_only"

GITHUB_REPO_OWNER = "schemadesign"
GITHUB_REPOSITORY = "schema_cms"

BACKEND_URL = "https://{domain}/api/v1/"


def get_function_base_name(fn):
    return fn.to_string().split("/")[-1]


class BaseResources(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.app_registry = aws_ecr.Repository(
            self,
            "schema-cms-app-ecr",
            repository_name="schema-cms-app",
            removal_policy=core.RemovalPolicy.DESTROY,
        )
        self.nginx_registry = aws_ecr.Repository(
            self,
            "schema-cms-nginx-ecr",
            repository_name="schema-cms-nginx",
            removal_policy=core.RemovalPolicy.DESTROY,
        )
        self.worker_registry = aws_ecr.Repository(
            self,
            "schema-cms-worker-ecr",
            repository_name="schema-cms-worker",
            removal_policy=core.RemovalPolicy.DESTROY,
        )
        self.webapp_registry = aws_ecr.Repository(
            self,
            "schema-cms-webapp-ecr",
            repository_name="schema-cms-webapp",
            removal_policy=core.RemovalPolicy.DESTROY,
        )

        self.vpc = aws_ec2.Vpc(self, "vpc", nat_gateways=1)
        self.cluster = aws_ecs.Cluster(
            self, "worker-cluster", cluster_name="schema-ecs-cluster", vpc=self.vpc
        )
        self.db = aws_rds.DatabaseInstance(
            self,
            "db",
            master_username="root",
            database_name=DB_NAME,
            engine=aws_rds.DatabaseInstanceEngine.POSTGRES,
            storage_encrypted=True,
            allocated_storage=50,
            instance_class=aws_ec2.InstanceType.of(
                aws_ec2.InstanceClass.BURSTABLE2, aws_ec2.InstanceSize.SMALL
            ),
            vpc=self.vpc,
            # todo: remove lines below
            deletion_protection=False,
            delete_automated_backups=True,
        )
        self.app_bucket = aws_s3.Bucket(self, APP_S3_BUCKET_NAME, versioned=True)


class CertsStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        domain_name = self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY)
        self.cert = aws_certificatemanager.Certificate(
            self, "cert", domain_name=domain_name
        )


class API(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.djangoSecret = aws_secretsmanager.Secret(self, "django-secret")
        django_secret_key = aws_ecs.Secret.from_secrets_manager(self.djangoSecret)

        api_lambda_token_secret = aws_secretsmanager.Secret.from_secret_arn(
            self,
            LAMBDA_AUTH_TOKEN_ENV_NAME,
            self.node.try_get_context("lambda_auth_token"),
        )
        self.api_lambda_token = api_lambda_token_secret.secret_value.to_string()

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        api_image = aws_ecs.ContainerImage.from_asset("backend/app")
        nginx_image = aws_ecs.ContainerImage.from_asset("nginx")

        self.pages_bucket = aws_s3.Bucket(
            self, PAGES_S3_BUCKET_NAME, public_read_access=True
        )

        if installation_mode == INSTALLATION_MODE_FULL:
            tag_from_context = self.node.try_get_context("app_image_tag")
            tag = tag_from_context if tag_from_context is not "undefined" else None
            api_image = aws_ecs.ContainerImage.from_ecr_repository(
                scope.base.app_registry, tag
            )
            nginx_image = aws_ecs.ContainerImage.from_ecr_repository(
                scope.base.nginx_registry, tag
            )

        env_map = {
            "DJANGO_DEBUG": "django_debug",
            "DJANGO_SOCIAL_AUTH_AUTH0_KEY": "django_social_auth_auth0_key_arn",
            "DJANGO_SOCIAL_AUTH_AUTH0_SECRET": "django_social_auth_auth0_secret_arn",
            "DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN": "django_social_auth_auth0_domain_arn",
            "DJANGO_USER_MGMT_BACKEND": "django_user_mgmt_backend_arn",
            "DJANGO_USER_MGMT_AUTH0_DOMAIN": "django_user_mgmt_auth0_domain_arn",
            "DJANGO_USER_MGMT_AUTH0_KEY": "django_user_mgmt_auth0_key_arn",
            "DJANGO_USER_MGMT_AUTH0_SECRET": "django_user_mgmt_auth0_secret_arn",
            "DJANGO_WEBAPP_HOST": "django_webapp_host_arn",
            "SENTRY_DNS": "sentry_dns_arn",
            "DJANGO_DEFAULT_FROM_EMAIL": "django_default_from_email_arn",
            "DJANGO_HOST": "django_host_arn",
            "DJANGO_ROOT_PASSWORD": "django_root_password_arn",
            "DB_CONNECTION": "db_connection_arn",
        }

        self.env = {k: self.map_secret(v) for k, v in env_map.items()}

        self.job_processing_dead_letter_sqs = aws_sqs.Queue(
            self, "job_processing_dead_letter_sqs",
        )
        self.job_processing_queues = [
            self._create_job_processing_queue(
                scope=scope,
                name=f"job_processing_sqs",
                dead_letter_queue=self.job_processing_dead_letter_sqs,
            ),
            self._create_job_processing_queue(
                scope=scope,
                name=f"job_processing_sqs_ext",
                dead_letter_queue=self.job_processing_dead_letter_sqs,
            ),
            self._create_job_processing_queue(
                scope=scope,
                name=f"job_processing_sqs_max",
                dead_letter_queue=self.job_processing_dead_letter_sqs,
            ),
        ]

        self.api = aws_ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            "api-service",
            cluster=scope.base.cluster,
            task_image_options=aws_ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=nginx_image,
                container_name="nginx",
                container_port=80,
                enable_logging=True,
            ),
            desired_count=1,
            cpu=512,
            memory_limit_mib=1024,
            certificate=scope.certs.cert,
            domain_name=self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY),
            domain_zone=aws_route53.PrivateHostedZone(
                self,
                "zone",
                vpc=scope.base.vpc,
                zone_name=self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY),
            ),
        )

        self.api.task_definition.add_container(
            "backend",
            image=api_image,
            logging=aws_ecs.AwsLogDriver(stream_prefix="backend-container"),
            environment={
                "POSTGRES_DB": DB_NAME,
                "AWS_STORAGE_BUCKET_NAME": scope.base.app_bucket.bucket_name,
                "AWS_STORAGE_PAGES_BUCKET_NAME": self.pages_bucket.bucket_name,
                "SQS_WORKER_QUEUE_URL": self.job_processing_queues[0].queue_url,
                "SQS_WORKER_EXT_QUEUE_URL": self.job_processing_queues[1].queue_url,
                "SQS_WORKER_MAX_QUEUE_URL": self.job_processing_queues[2].queue_url,
                LAMBDA_AUTH_TOKEN_ENV_NAME: self.api_lambda_token,
            },
            secrets={"DJANGO_SECRET_KEY": django_secret_key, **self.env,},
            cpu=512,
            memory_limit_mib=1024,
        )

        self.djangoSecret.grant_read(self.api.service.task_definition.task_role)

        scope.base.app_bucket.grant_read_write(
            self.api.service.task_definition.task_role
        )
        self.pages_bucket.grant_read_write(self.api.service.task_definition.task_role)

        scope.image_resize_lambda.image_bucket.grant_read(
            self.api.service.task_definition.task_role
        )

        for queue in self.job_processing_queues:
            queue.grant_send_messages(self.api.service.task_definition.task_role)

        for v in self.env.values():
            self.grant_secret_access(v)

        self.api.service.connections.allow_to(
            scope.base.db.connections, aws_ec2.Port.tcp(5432)
        )
        self.api.task_definition.add_to_task_role_policy(
            aws_iam.PolicyStatement(
                actions=["ses:SendRawEmail", "ses:SendBulkTemplatedEmail",],
                resources=["*"],
            )
        )

    def map_secret(self, secret_arn):
        secret = aws_secretsmanager.Secret.from_secret_arn(
            self, secret_arn + "-secret", self.node.try_get_context(secret_arn)
        )
        return aws_ecs.Secret.from_secrets_manager(secret)

    def grant_secret_access(self, secret):
        secret.grant_read(self.api.service.task_definition.task_role)

    def _create_job_processing_queue(self, scope, name, dead_letter_queue):
        return aws_sqs.Queue(
            self,
            name,
            visibility_timeout=core.Duration.seconds(300),
            dead_letter_queue=aws_sqs.DeadLetterQueue(
                queue=dead_letter_queue, max_receive_count=JOB_PROCESSING_MAX_RETRIES
            ),
        )


class LambdaWorker(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.functions = [
            self._create_lambda_fn(scope=scope, memory_size=memory_size, queue=queue)
            for memory_size, queue in zip(
                JOB_PROCESSING_MEMORY_SIZES, scope.api.job_processing_queues
            )
        ]

    def _create_lambda_fn(self, scope, memory_size, queue):
        lambda_code = aws_lambda.Code.from_cfn_parameters()
        name = f"lambda-worker-{memory_size}"
        lambda_fn = aws_lambda.Function(
            self,
            name,
            code=lambda_code,
            runtime=aws_lambda.Runtime.PYTHON_3_8,
            handler="handler.main",
            environment={
                "AWS_STORAGE_BUCKET_NAME": scope.base.app_bucket.bucket_name,
                "IMAGE_SCRAPING_FETCH_TIMEOUT": "15",
                "AWS_IMAGE_STORAGE_BUCKET_NAME": scope.image_resize_lambda.image_bucket.bucket_name,
                "AWS_IMAGE_STATIC_URL": scope.image_resize_lambda.image_bucket.bucket_website_url,
                "BACKEND_URL": BACKEND_URL.format(
                    domain=self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY)
                ),
                "SENTRY_DNS": self.get_secret(
                    "sentry_dns_arn", name + "-secret"
                ).secret_value.to_string(),
                LAMBDA_AUTH_TOKEN_ENV_NAME: scope.api.api_lambda_token,
            },
            memory_size=memory_size,
            timeout=core.Duration.seconds(300),
            tracing=aws_lambda.Tracing.ACTIVE,
        )
        lambda_fn.add_event_source(
            aws_lambda_event_sources.SqsEventSource(queue, batch_size=1)
        )
        scope.base.app_bucket.grant_read_write(lambda_fn.role)
        scope.image_resize_lambda.image_bucket.grant_read_write(lambda_fn.role)
        return lambda_fn, lambda_code

    def get_secret(self, secret_arn, secret_suffix):
        return aws_secretsmanager.Secret.from_secret_attributes(
            self,
            secret_arn + secret_suffix,
            secret_arn=self.node.try_get_context(secret_arn),
        )


class PublicAPI(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.function_code = aws_lambda.Code.from_cfn_parameters()

        handler = "wsgi_handler.handler"
        db_connection_arn = self.node.try_get_context("db_connection_arn")
        rds_proxy_url_arn = self.node.try_get_context("rds_proxy_url_arn")

        self.public_api_lambda = aws_lambda.Function(
            self,
            "public-api-lambda",
            code=self.function_code,
            handler=handler,
            runtime=aws_lambda.Runtime.PYTHON_3_8,
            environment={
                "AWS_STORAGE_BUCKET_NAME": scope.base.app_bucket.bucket_name,
                "AWS_STORAGE_PAGES_BUCKET_NAME": scope.api.pages_bucket.bucket_name,
                "BACKEND_URL": BACKEND_URL.format(
                    domain=self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY)
                ),
                "RDS_PROXY_URL": aws_secretsmanager.Secret.from_secret_arn(
                    self, "rds_proxy", rds_proxy_url_arn
                ).secret_value.to_string(),
                "DB_CONNECTION": aws_secretsmanager.Secret.from_secret_arn(
                    self, "db_conn", db_connection_arn
                ).secret_value.to_string(),
            },
            memory_size=512,
            timeout=core.Duration.seconds(60),
            tracing=aws_lambda.Tracing.ACTIVE,
        )

        scope.base.app_bucket.grant_read(self.public_api_lambda.role)
        scope.api.pages_bucket.grant_read(self.public_api_lambda.role)

        self.public_api_lambda.connections.allow_to(
            scope.base.db.connections, aws_ec2.Port.tcp(5432)
        )
        self.publicApiLambdaIntegration = aws_apigateway.LambdaRestApi(
            self, "rest-api", handler=self.public_api_lambda
        )


class ImageResize(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        domain_name = self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY)

        (
            self.image_resize_lambda,
            self.function_code,
            self.api_gateway,
        ) = self.create_lambda()
        self.image_bucket = self.create_bucket(lambda_url=self.api_gateway.url)
        self.image_resize_lambda.add_environment(
            key="BUCKET", value=self.image_bucket.bucket_name
        )
        self.image_resize_lambda.add_environment(
            key="REDIRECT_URL", value=self.image_bucket.bucket_website_url
        )
        self.image_resize_lambda.add_environment(
            key="CORS_ORIGIN", value=f"https://{domain_name}"
        )
        self.image_resize_lambda.add_environment(
            key="ALLOWED_DIMENSIONS", value="150x150,1024x1024"
        )
        self.image_bucket.grant_read_write(self.image_resize_lambda.role)

    def create_bucket(self, lambda_url):
        parsed_url = parse.urlparse(lambda_url)
        protocol_mapping = {
            "HTTP": aws_s3.RedirectProtocol.HTTP,
            "HTTPS": aws_s3.RedirectProtocol.HTTPS,
        }
        return aws_s3.Bucket(
            self,
            IMAGE_S3_BUCKET_NAME,
            public_read_access=True,
            website_index_document="index.html",
            website_routing_rules=[
                aws_s3.RoutingRule(
                    condition=aws_s3.RoutingRuleCondition(
                        http_error_code_returned_equals="404"
                    ),
                    protocol=protocol_mapping[
                        parsed_url.scheme.upper()
                    ],  # enum required
                    host_name=parsed_url.netloc,
                    replace_key=aws_s3.ReplaceKey.prefix_with("prod/resize?key="),
                    http_redirect_code="307",
                )
            ],
        )

    def create_lambda(self):
        code = aws_lambda.Code.from_cfn_parameters()
        image_resize_lambda = aws_lambda.Function(
            self,
            "image-resize-lambda",
            code=code,
            handler="index.handler",
            runtime=aws_lambda.Runtime.NODEJS_10_X,
            memory_size=512,
            timeout=core.Duration.seconds(30),
            tracing=aws_lambda.Tracing.ACTIVE,
        )

        api_gateway = aws_apigateway.LambdaRestApi(
            self, "lambda-image-resize-api", handler=image_resize_lambda
        )

        return image_resize_lambda, code, api_gateway


class CIPipeline(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        if installation_mode != INSTALLATION_MODE_FULL:
            self.node.add_error(
                "Deploy of ci-pipeline stack is only available in `full` installation_mode. "
                "Check your installation_mode in CDK context"
            )

        # deploy to env pipeline
        self.pipeline = aws_codepipeline.Pipeline(
            self, "deploy-pipeline", pipeline_name="schema-cms-deploy-pipeline"
        )

        source_output = aws_codepipeline.Artifact()
        github_token_arn = self.node.try_get_context("github_token_arn")
        oauth_token = aws_secretsmanager.Secret.from_secret_arn(
            self, "gh-token", github_token_arn
        )

        self.pipeline.add_stage(
            stage_name="source",
            actions=[
                aws_codepipeline_actions.GitHubSourceAction(
                    action_name="github_source",
                    owner=GITHUB_REPO_OWNER,
                    repo=GITHUB_REPOSITORY,
                    branch="master",
                    trigger=aws_codepipeline_actions.GitHubTrigger.WEBHOOK,
                    output=source_output,
                    oauth_token=oauth_token.secret_value,
                ),
            ],
        )

        fe_build_spec = aws_codebuild.BuildSpec.from_source_filename(
            "buildspec-frontend.yaml"
        )
        build_fe_project = aws_codebuild.PipelineProject(
            self,
            "build_fe_project",
            project_name="schema_cms_fe_build",
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "NGINX_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.nginx_registry.repository_uri
                    ),
                    "APP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                    "WEBAPP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.webapp_registry.repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="1"),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            build_spec=fe_build_spec,
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
        )
        scope.base.nginx_registry.grant_pull_push(build_fe_project)
        scope.base.app_registry.grant_pull_push(build_fe_project)
        scope.base.webapp_registry.grant_pull_push(build_fe_project)

        build_fe_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_fe",
            input=source_output,
            project=build_fe_project,
            run_order=2,
        )

        app_build_spec = aws_codebuild.BuildSpec.from_source_filename(
            "buildspec-app.yaml"
        )
        build_app_project = aws_codebuild.PipelineProject(
            self,
            "build_app_project",
            project_name="schema_cms_app_build",
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="1"),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=app_build_spec,
        )
        scope.base.app_registry.grant_pull_push(build_app_project)

        build_app_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_app",
            input=source_output,
            project=build_app_project,
            run_order=1,
        )

        build_public_api_lambda_project = aws_codebuild.PipelineProject(
            self,
            "build_public_api_lambda_project",
            project_name="schema_cms_build_public_api",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_3_0
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename(
                "backend/functions/buildspec-public_api.yaml"
            ),
        )

        public_api_lambda_build_output = aws_codepipeline.Artifact()
        build_public_api_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_public_api_lambda",
            input=source_output,
            project=build_public_api_lambda_project,
            outputs=[public_api_lambda_build_output],
        )

        build_image_resize_lambda_project = aws_codebuild.PipelineProject(
            self,
            "build_image_resize_lambda_project",
            project_name="schema_cms_build_image_resize_lambda",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename(
                "backend/functions/buildspec-image-resize-lambda.yaml"
            ),
        )

        image_resize_lambda_build_output = aws_codepipeline.Artifact()
        build_image_resize_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_image_resize_lambda",
            input=source_output,
            project=build_image_resize_lambda_project,
            outputs=[image_resize_lambda_build_output],
        )

        build_cdk_project = aws_codebuild.PipelineProject(
            self,
            "build_cdk_project",
            project_name="schema_cms_stack_ci",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename(
                "buildspec-cdk.yaml"
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.CUSTOM),
        )

        cdk_artifact = aws_codepipeline.Artifact()
        build_cdk_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_stack",
            input=source_output,
            project=build_cdk_project,
            outputs=[cdk_artifact],
            run_order=2,
            extra_inputs=[],
        )

        lambda_workers_build_actions = self.get_lambda_worker_build_actions(
            scope=scope, action_input=source_output
        )

        self.pipeline.add_stage(
            stage_name="build_app",
            actions=[
                build_fe_action,
                build_app_action,
                build_image_resize_lambda_action,
                *[action for (action, *_) in lambda_workers_build_actions],
                build_public_api_lambda_action,
                build_cdk_action,
            ],
        )

        self.pipeline.add_stage(
            stage_name="deploy_public_api",
            actions=[
                aws_codepipeline_actions.ManualApprovalAction(
                    action_name="approve_changes", run_order=1
                ),
                self.prepare_lambda_worker_changes(
                    scope=scope,
                    cdk_artifact=cdk_artifact,
                    build_actions=lambda_workers_build_actions,
                    admin_permissions=True,
                    run_order=2,
                ),
                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name="prepare_public_api_changes",
                    stack_name=scope.public_api.stack_name,
                    change_set_name="publicAPIStagedChangeSet",
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path(
                        "cdk.out/public-api.template.json"
                    ),
                    run_order=2,
                    parameter_overrides={
                        **scope.public_api.function_code.assign(
                            bucket_name=public_api_lambda_build_output.s3_location.bucket_name,
                            object_key=public_api_lambda_build_output.s3_location.object_key,
                            object_version=public_api_lambda_build_output.s3_location.object_version,
                        )
                    },
                    extra_inputs=[public_api_lambda_build_output],
                ),
                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name="prepare_image_resize_lambda_changes",
                    stack_name=scope.image_resize_lambda.stack_name,
                    change_set_name="imageResizeLambdaStagedChangeSet",
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path(
                        "cdk.out/image-resize.template.json"
                    ),
                    run_order=2,
                    parameter_overrides={
                        **scope.image_resize_lambda.function_code.assign(
                            bucket_name=image_resize_lambda_build_output.s3_location.bucket_name,
                            object_key=image_resize_lambda_build_output.s3_location.object_key,
                            object_version=image_resize_lambda_build_output.s3_location.object_version,
                        )
                    },
                    extra_inputs=[image_resize_lambda_build_output],
                ),
                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name="prepare_api_changes",
                    stack_name=scope.api.stack_name,
                    change_set_name="APIStagedChangeSet",
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path("cdk.out/api.template.json"),
                    run_order=2,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_image_resize_lambda_changes",
                    stack_name=scope.image_resize_lambda.stack_name,
                    change_set_name="imageResizeLambdaStagedChangeSet",
                    run_order=3,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_api_changes",
                    stack_name=scope.api.stack_name,
                    change_set_name="APIStagedChangeSet",
                    run_order=4,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_public_api_changes",
                    stack_name=scope.public_api.stack_name,
                    change_set_name="publicAPIStagedChangeSet",
                    run_order=5,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_lambda_worker_changes",
                    stack_name=scope.lambda_worker.stack_name,
                    change_set_name="lambdaWorkerStagedChangeSet",
                    run_order=6,
                ),
            ],
        )

        # pull request tests
        gh_source = aws_codebuild.Source.git_hub(
            owner=GITHUB_REPO_OWNER,
            repo=GITHUB_REPOSITORY,
            webhook=True,
            webhook_filters=[
                aws_codebuild.FilterGroup.in_event_of(
                    aws_codebuild.EventAction.PULL_REQUEST_CREATED
                ),
                aws_codebuild.FilterGroup.in_event_of(
                    aws_codebuild.EventAction.PULL_REQUEST_UPDATED
                ),
                aws_codebuild.FilterGroup.in_event_of(
                    aws_codebuild.EventAction.PULL_REQUEST_REOPENED
                ),
            ],
        )

        self.app_ci_project = aws_codebuild.Project(
            self,
            "schema_cms_app_pr_build",
            project_name="schema_cms_app_ci",
            source=gh_source,
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="0"),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=app_build_spec,
        )
        scope.base.app_registry.grant_pull_push(self.app_ci_project.role)

        self.fe_ci_project = aws_codebuild.Project(
            self,
            "schema_cms_fe_pr_build",
            project_name="schema_cms_fe_ci",
            source=gh_source,
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "NGINX_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.nginx_registry.repository_uri
                    ),
                    "APP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                    "WEBAPP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.webapp_registry.repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="0"),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.CUSTOM),
            build_spec=fe_build_spec,
        )

        scope.base.nginx_registry.grant_pull(self.fe_ci_project)
        scope.base.app_registry.grant_pull(self.fe_ci_project)
        scope.base.webapp_registry.grant_pull(self.fe_ci_project)

    def get_lambda_worker_build_actions(self, scope, action_input):
        actions_with_outputs = []
        for (function, code) in scope.lambda_worker.functions:
            function_name = get_function_base_name(function)
            project = aws_codebuild.PipelineProject(
                self,
                f"project_build_{function_name}",
                project_name=f"project_build_{function_name}",
                environment=aws_codebuild.BuildEnvironment(
                    build_image=aws_codebuild.LinuxBuildImage.STANDARD_3_0
                ),
                build_spec=aws_codebuild.BuildSpec.from_source_filename(
                    "backend/functions/buildspec-lambda-worker.yaml"
                ),
            )
            output = aws_codepipeline.Artifact()
            action = aws_codepipeline_actions.CodeBuildAction(
                action_name=f"build_{function_name}",
                input=action_input,
                project=project,
                outputs=[output],
            )
            actions_with_outputs.append((action, output, function, code))
        return actions_with_outputs

    def prepare_lambda_worker_changes(
        self, scope, cdk_artifact, build_actions, **change_set_kwargs
    ):
        parameter_overrides = dict()
        extra_inputs = []
        for (_, output, _, code) in build_actions:
            parameter_overrides.update(
                **code.assign(
                    bucket_name=output.s3_location.bucket_name,
                    object_key=output.s3_location.object_key,
                    object_version=output.s3_location.object_version,
                )
            )
            extra_inputs.append(output)
        return aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
            action_name=f"prepare_lambda_worker_changes",
            stack_name=scope.lambda_worker.stack_name,
            change_set_name=f"lambdaWorkerStagedChangeSet",
            template_path=cdk_artifact.at_path("cdk.out/lambda-worker.template.json"),
            parameter_overrides=parameter_overrides,
            extra_inputs=extra_inputs,
            **change_set_kwargs,
        )
