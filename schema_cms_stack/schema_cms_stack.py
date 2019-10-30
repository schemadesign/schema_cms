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
    aws_rds,
    aws_secretsmanager,
    aws_codebuild,
    aws_ecr,
    aws_codepipeline,
    aws_codepipeline_actions,
    aws_stepfunctions,
    aws_stepfunctions_tasks,
    aws_certificatemanager,
    aws_route53,
)

DB_NAME = "gistdb"
APP_S3_BUCKET_NAME = "schemacms"
JOB_PROCESSING_MAX_RETRIES = 3
JOB_PROCESSING_MEMORY_SIZES = [512, 1280]

INSTALLATION_MODE_CONTEXT_KEY = "installation_mode"
DOMAIN_NAME_CONTEXT_KEY = "domain_name"

INSTALLATION_MODE_FULL = "full"
INSTALLATION_MODEL_APP_ONLY = "app_only"

GITHUB_REPO_OWNER = "schemadesign"
GITHUB_REPOSITORY = "schema_cms"


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
        self.db_secret_rotation = self.db.add_rotation_single_user("db-rotation")
        self.app_bucket = aws_s3.Bucket(self, APP_S3_BUCKET_NAME, versioned=True)


class CertsStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        domain_name = self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY)
        self.cert = aws_certificatemanager.Certificate(self, "cert", domain_name=domain_name)


class Workers(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.worker_task_definition = aws_ecs.FargateTaskDefinition(
            self, "worker-task-definition", cpu=256, memory_limit_mib=512
        )
        scope.base.db.secret.grant_read(self.worker_task_definition.task_role)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        worker_image = aws_ecs.ContainerImage.from_asset("backend/worker")
        if installation_mode == INSTALLATION_MODE_FULL:
            tag_from_context = self.node.try_get_context("app_image_tag")
            tag = tag_from_context if tag_from_context is not "undefined" else None
            worker_image = aws_ecs.ContainerImage.from_ecr_repository(scope.base.worker_registry, tag)

        self.worker_container = self.worker_task_definition.add_container(
            "worker",
            image=worker_image,
            logging=aws_ecs.AwsLogDriver(stream_prefix="worker-container"),
            environment={"DB_SECRET_ARN": scope.base.db.secret.secret_arn, "POSTGRES_DB": DB_NAME},
        )

        worker_success_lambda_code = aws_lambda.AssetCode("backend/functions/worker_success")
        self.success_function_code = aws_lambda.Code.from_cfn_parameters()
        handler = "handlers.handle"
        if installation_mode == INSTALLATION_MODE_FULL:
            worker_success_lambda_code = self.success_function_code
            handler = "backend/functions/worker_success/handlers.handle"

        self.worker_success_lambda = aws_lambda.Function(
            self,
            "worker-success-lambda",
            code=worker_success_lambda_code,
            handler=handler,
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            vpc=scope.base.vpc,
        )

        worker_failure_lambda_code = aws_lambda.AssetCode("backend/functions/worker_failure")

        self.failure_function_code = aws_lambda.Code.from_cfn_parameters()
        handler = "handlers.handle"
        if installation_mode == INSTALLATION_MODE_FULL:
            worker_failure_lambda_code = self.failure_function_code
            handler = "backend/functions/worker_failure/handlers.handle"

        self.worker_failure_lambda = aws_lambda.Function(
            self,
            "worker-failure-lambda",
            code=worker_failure_lambda_code,
            handler=handler,
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            vpc=scope.base.vpc,
        )

        run_worker_task = aws_stepfunctions_tasks.RunEcsFargateTask(
            cluster=scope.base.cluster,
            task_definition=self.worker_task_definition,
            subnets=scope.base.vpc.select_subnets(),
            integration_pattern=aws_stepfunctions.ServiceIntegrationPattern.SYNC,
        )
        run_worker_task.connections.allow_to(scope.base.db.connections, aws_ec2.Port.tcp(5432))
        self.start_worker_job = aws_stepfunctions.Task(self, "Start Worker", task=run_worker_task)

        run_worker_success = aws_stepfunctions.Task(
            self, "Worker Success", task=aws_stepfunctions_tasks.InvokeFunction(self.worker_success_lambda)
        )

        run_worker_failure = aws_stepfunctions.Task(
            self, "Worker Failure", task=aws_stepfunctions_tasks.InvokeFunction(self.worker_failure_lambda)
        )

        stm_definition = self.start_worker_job.next(run_worker_success)
        self.start_worker_job.add_catch(run_worker_failure)

        self.worker_state_machine = aws_stepfunctions.StateMachine(
            self, "WorkerStateMachine", definition=stm_definition
        )


class API(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.djangoSecret = aws_secretsmanager.Secret(self, "django-secret")
        django_secret_key = aws_ecs.Secret.from_secrets_manager(self.djangoSecret)
        connection_secret_key = aws_ecs.Secret.from_secrets_manager(scope.base.db.secret)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        api_image = aws_ecs.ContainerImage.from_asset("backend/app")
        nginx_image = aws_ecs.ContainerImage.from_asset("nginx")
        if installation_mode == INSTALLATION_MODE_FULL:
            tag_from_context = self.node.try_get_context("app_image_tag")
            tag = tag_from_context if tag_from_context is not "undefined" else None
            api_image = aws_ecs.ContainerImage.from_ecr_repository(scope.base.app_registry, tag)
            nginx_image = aws_ecs.ContainerImage.from_ecr_repository(scope.base.nginx_registry, tag)

        env_map = {
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
        }

        env = {k: self.map_secret(v) for k, v in env_map.items()}

        self.job_processing_dead_letter_sqs = aws_sqs.Queue(
            self,
            'job_processing_dead_letter_sqs',
        )
        self.job_processing_queues = [
            self._create_job_processing_queue(
                scope=scope,
                name=f"job_processing_sqs_{memory_size}",
                dead_letter_queue=self.job_processing_dead_letter_sqs,
            )
            for memory_size in JOB_PROCESSING_MEMORY_SIZES
        ]

        self.api = aws_ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            "api-service",
            cluster=scope.base.cluster,
            image=nginx_image,
            desired_count=1,
            cpu=256,
            memory_limit_mib=512,
            container_name="nginx",
            enable_logging=True,
            container_port=80,
            certificate=scope.certs.cert,
            domain_name=self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY),
            domain_zone=aws_route53.PrivateHostedZone(
                self, "zone", vpc=scope.base.vpc, zone_name=self.node.try_get_context(DOMAIN_NAME_CONTEXT_KEY)
            ),
        )

        self.api.task_definition.add_container(
            "backend",
            image=api_image,
            logging=aws_ecs.AwsLogDriver(stream_prefix="backend-container"),
            environment={
                "WORKER_STM_ARN": scope.workers.worker_state_machine.state_machine_arn,
                "POSTGRES_DB": DB_NAME,
                "AWS_STORAGE_BUCKET_NAME": scope.base.app_bucket.bucket_name,
                "SQS_WORKER_QUEUE_URL": self.job_processing_queues[0].queue_url,
                "SQS_WORKER_EXT_QUEUE_URL": self.job_processing_queues[1].queue_url,
            },
            secrets={"DJANGO_SECRET_KEY": django_secret_key, "DB_CONNECTION": connection_secret_key, **env},
            cpu=256,
            memory_limit_mib=512,
        )

        self.djangoSecret.grant_read(self.api.service.task_definition.task_role)
        scope.workers.worker_state_machine.grant_start_execution(self.api.service.task_definition.task_role)
        scope.base.app_bucket.grant_read_write(self.api.service.task_definition.task_role)

        for queue in self.job_processing_queues:
            queue.grant_send_messages(self.api.service.task_definition.task_role)

        for k, v in env.items():
            self.grant_secret_access(v)

        self.api.service.connections.allow_to(scope.base.db.connections, aws_ec2.Port.tcp(5432))

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
            visibility_timeout=core.Duration.seconds(60),
            dead_letter_queue=aws_sqs.DeadLetterQueue(
                queue=dead_letter_queue,
                max_receive_count=JOB_PROCESSING_MAX_RETRIES
            )
        )


class LambdaWorker(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.functions = [
            self._create_lambda_fn(scope=scope, memory_size=memory_size, queue=queue)
            for memory_size, queue in zip(JOB_PROCESSING_MEMORY_SIZES, scope.api.job_processing_queues)
        ]

    def _create_lambda_fn(self, scope, memory_size, queue):
        lambda_code = aws_lambda.Code.from_cfn_parameters()
        lambda_fn = aws_lambda.Function(
            self,
            f"lambda-worker-{memory_size}",
            code=lambda_code,
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            handler="handler.main",
            environment={
                "AWS_STORAGE_BUCKET_NAME": scope.base.app_bucket.bucket_name,
            },
            memory_size=memory_size,
            timeout=core.Duration.seconds(60),
            tracing=aws_lambda.Tracing.ACTIVE,
        )
        lambda_fn.add_event_source(
            aws_lambda_event_sources.SqsEventSource(queue, batch_size=1)
        )
        scope.base.db.secret.grant_read(lambda_fn.role)
        scope.base.app_bucket.grant_read_write(lambda_fn.role)
        return lambda_fn, lambda_code


class PublicAPI(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.function_code = aws_lambda.Code.from_cfn_parameters()
        handler = "wsgi_handler.handler"
        self.public_api_lambda = aws_lambda.Function(
            self,
            "public-api-lambda",
            code=self.function_code,
            handler=handler,
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            vpc=scope.base.vpc,
            environment={
                "DB_SECRET_ARN": scope.base.db.secret.secret_arn,
                "DB_CONNECTION": scope.base.db.secret.secret_value.to_string(),
                "AWS_STORAGE_BUCKET_NAME": scope.base.app_bucket.bucket_name,
                "BACKEND_URL": scope.base.db.secret.secret_value.to_string(),
            },
            memory_size=512,
            timeout=core.Duration.seconds(30),
            tracing=aws_lambda.Tracing.ACTIVE,
        )

        scope.base.db.secret.grant_read(self.public_api_lambda.role)
        scope.base.app_bucket.grant_read(self.public_api_lambda.role)

        self.publicApiGateway = aws_apigateway.RestApi(self, "rest-api")
        self.publicApiLambdaIntegration = aws_apigateway.LambdaIntegration(self.public_api_lambda)
        self.publicApiGateway.root.add_resource("datasources").add_resource("{data_source_id}").add_method(
            "GET", self.publicApiLambdaIntegration
        )


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
        oauth_token = aws_secretsmanager.Secret.from_secret_arn(self, "gh-token", github_token_arn)

        pipeline_source_action = aws_codepipeline_actions.GitHubSourceAction(
            action_name="github_source",
            owner=GITHUB_REPO_OWNER,
            repo=GITHUB_REPOSITORY,
            branch="master",
            trigger=aws_codepipeline_actions.GitHubTrigger.WEBHOOK,
            output=source_output,
            oauth_token=oauth_token.secret_value,
        )

        self.pipeline.add_stage(stage_name="source", actions=[pipeline_source_action])

        fe_build_spec = aws_codebuild.BuildSpec.from_source_filename("buildspec-frontend.yaml")
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
            action_name="build_fe", input=source_output, project=build_fe_project, run_order=2
        )

        app_build_spec = aws_codebuild.BuildSpec.from_source_filename("buildspec-app.yaml")
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
            action_name="build_app", input=source_output, project=build_app_project, run_order=1
        )

        build_workers_project = aws_codebuild.PipelineProject(
            self,
            "build_workers_project",
            project_name="schema_cms_workers_ci",
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.worker_registry.repository_uri
                    )
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=aws_codebuild.BuildSpec.from_source_filename("buildspec-worker.yaml"),
        )
        scope.base.worker_registry.grant_pull_push(build_workers_project)

        build_workers_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_workers", input=source_output, project=build_workers_project
        )

        build_public_api_lambda_project = aws_codebuild.PipelineProject(
            self,
            "build_public_api_lambda_project",
            project_name="schema_cms_build_public_api",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
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

        build_workers_success_lambda_project = aws_codebuild.PipelineProject(
            self,
            "build_workers_success_lambda_project",
            project_name="schema_cms_build_workers_success",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename(
                "backend/functions/buildspec-worker-success.yaml"
            ),
        )

        workers_success_lambda_build_output = aws_codepipeline.Artifact()
        build_workers_success_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_workers_success_lambda",
            input=source_output,
            project=build_workers_success_lambda_project,
            outputs=[workers_success_lambda_build_output],
        )

        build_workers_failure_lambda_project = aws_codebuild.PipelineProject(
            self,
            "build_workers_failure_lambda_project",
            project_name="schema_cms_build_workers_failure",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename(
                "backend/functions/buildspec-worker-failure.yaml"
            ),
        )

        workers_failure_lambda_build_output = aws_codepipeline.Artifact()
        build_workers_failure_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name="build_workers_failure_lambda",
            input=source_output,
            project=build_workers_failure_lambda_project,
            outputs=[workers_failure_lambda_build_output],
        )

        build_cdk_project = aws_codebuild.PipelineProject(
            self,
            "build_cdk_project",
            project_name="schema_cms_stack_ci",
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename("buildspec-cdk.yaml"),
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
            scope=scope,
            action_input=source_output
        )

        self.pipeline.add_stage(
            stage_name="build_app",
            actions=[
                build_fe_action,
                build_app_action,
                build_workers_action,
                *lambda_workers_build_actions,
                build_public_api_lambda_action,
                build_workers_success_lambda_action,
                build_workers_failure_lambda_action,
                build_cdk_action,
            ],
        )

        self.pipeline.add_stage(
            stage_name="deploy_public_api",
            actions=[
                *[
                    aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                        action_name=f"prepare_lambda_worker_changes_{i}",
                        stack_name=scope.lambda_worker.stack_name,
                        change_set_name=f"lambdaWorker{i}StagedChangeSet",
                        admin_permissions=True,
                        template_path=cdk_artifact.at_path("cdk.out/lambda-worker.template.json"),
                        run_order=1,
                        parameter_overrides={
                            *lambda_code.assign(
                                bucket_name=action.outputs[0].s3_location.bucket_name,
                                object_key=action.outputs[0].s3_location.object_key,
                                object_version=action.outputs[0].s3_location.object_version,
                            )
                        },
                        extra_inputs=[action.outputs[0]],
                    ) for i, ((_, lambda_code), action) in enumerate(
                        zip(scope.lambda_worker.functions, lambda_workers_build_actions),
                        1
                    )
                ],
                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name="prepare_public_api_changes",
                    stack_name=scope.public_api.stack_name,
                    change_set_name="publicAPIStagedChangeSet",
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path("cdk.out/public-api.template.json"),
                    run_order=1,
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
                    action_name="prepare_workers_changes",
                    stack_name=scope.workers.stack_name,
                    change_set_name="workersStagedChangeSet",
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path("cdk.out/workers.template.json"),
                    run_order=1,
                    parameter_overrides={
                        **scope.workers.success_function_code.assign(
                            bucket_name=workers_success_lambda_build_output.s3_location.bucket_name,
                            object_key=workers_success_lambda_build_output.s3_location.object_key,
                            object_version=workers_success_lambda_build_output.s3_location.object_version,
                        ),
                        **scope.workers.failure_function_code.assign(
                            bucket_name=workers_failure_lambda_build_output.s3_location.bucket_name,
                            object_key=workers_failure_lambda_build_output.s3_location.object_key,
                            object_version=workers_failure_lambda_build_output.s3_location.object_version,
                        ),
                    },
                    extra_inputs=[workers_success_lambda_build_output, workers_failure_lambda_build_output],
                ),
                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name="prepare_api_changes",
                    stack_name=scope.api.stack_name,
                    change_set_name="APIStagedChangeSet",
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path("cdk.out/api.template.json"),
                    run_order=1,
                ),
                aws_codepipeline_actions.ManualApprovalAction(action_name="approve_changes", run_order=2),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_lambda_worker_changes",
                    stack_name=scope.lambda_worker.stack_name,
                    change_set_name="lambdaWorkerStagedChangeSet",
                    run_order=3,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_workers_changes",
                    stack_name=scope.workers.stack_name,
                    change_set_name="workersStagedChangeSet",
                    run_order=3,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_public_api_changes",
                    stack_name=scope.public_api.stack_name,
                    change_set_name="publicAPIStagedChangeSet",
                    run_order=3,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name="execute_api_changes",
                    stack_name=scope.api.stack_name,
                    change_set_name="APIStagedChangeSet",
                    run_order=4,
                ),
            ],
        )

        # pull request tests
        gh_source = aws_codebuild.Source.git_hub(
            owner=GITHUB_REPO_OWNER,
            repo=GITHUB_REPOSITORY,
            webhook=True,
            webhook_filters=[
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PULL_REQUEST_CREATED),
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PULL_REQUEST_UPDATED),
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PULL_REQUEST_REOPENED),
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
        build_lambda_worker_projects = [
            aws_codebuild.PipelineProject(
                self,
                f"build_lambda_worker_project_{i}",
                project_name=f"schema_cms_build_lambda_worker_{i}",
                environment=aws_codebuild.BuildEnvironment(
                    build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0
                ),
                build_spec=aws_codebuild.BuildSpec.from_source_filename(
                    "backend/functions/buildspec-lambda-worker.yaml"
                ),
            ) for i in range(len(scope.lambda_worker.functions), 1)
        ]

        return [
            aws_codepipeline_actions.CodeBuildAction(
                action_name=f"build_worker_lambda_{i}",
                input=action_input,
                project=project,
                outputs=[aws_codepipeline.Artifact()],
            ) for i, project in enumerate(build_lambda_worker_projects, 1)
        ]
