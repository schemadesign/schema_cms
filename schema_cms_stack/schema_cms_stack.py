from aws_cdk import core, aws_ec2, aws_sqs, aws_apigateway, aws_lambda, aws_ecs, aws_iam, aws_ecs_patterns, aws_rds,\
    aws_secretsmanager, aws_codebuild, aws_ecr, aws_codepipeline, aws_codepipeline_actions

DB_NAME = 'gistdb'

INSTALLATION_MODE_CONTEXT_KEY = 'installation_mode'

INSTALLATION_MODE_FULL = 'full'
INSTALLATION_MODEL_APP_ONLY = 'app_only'

GITHUB_REPO_OWNER = 'schemadesign'
GITHUB_REPOSITORY = 'schema_cms'


class BaseResources(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.app_registry = aws_ecr.Repository(
            self,
            'schema-cms-app-ecr',
            repository_name='schema-cms-app',
            removal_policy=core.RemovalPolicy.DESTROY,
        )
        self.worker_registry = aws_ecr.Repository(
            self,
            'schema-cms-worker-ecr',
            repository_name='schema-cms-worker',
            removal_policy=core.RemovalPolicy.DESTROY,
        )

        self.vpc = aws_ec2.Vpc(self, 'vpc', nat_gateways=1)
        self.cluster = aws_ecs.Cluster(
            self,
            'worker-cluster',
            cluster_name='schema-ecs-cluster',
            vpc=self.vpc
        )
        self.db = aws_rds.DatabaseInstance(
            self,
            'db',
            master_username='root',
            database_name=DB_NAME,
            engine=aws_rds.DatabaseInstanceEngine.POSTGRES,
            storage_encrypted=True,
            allocated_storage=50,
            instance_class=aws_ec2.InstanceType.of(aws_ec2.InstanceClass.BURSTABLE2, aws_ec2.InstanceSize.SMALL),
            vpc=self.vpc,
            deletion_protection=False,
            delete_automated_backups=True,
        )
        self.db_secret_rotation = self.db.add_rotation_single_user('db-rotation')


class Workers(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.worker_task_definition = aws_ecs.FargateTaskDefinition(
            self,
            'worker-task-definition',
            cpu=256,
            memory_limit_mib=512,
        )
        scope.base.db.secret.grant_read(self.worker_task_definition.task_role)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        worker_image = aws_ecs.ContainerImage.from_asset('backend/worker')
        if installation_mode == INSTALLATION_MODE_FULL:
            tag_from_context = self.node.try_get_context('app_image_tag')
            tag = tag_from_context if tag_from_context is not 'undefined' else None
            worker_image = aws_ecs.ContainerImage.from_ecr_repository(scope.base.worker_registry, tag)

        self.worker_container = self.worker_task_definition.add_container(
            'worker',
            image=worker_image,
            logging=aws_ecs.AwsLogDriver(stream_prefix='worker-container'),
            environment={
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
                'POSTGRES_DB': DB_NAME
            }
        )

        self.worker_queue = aws_sqs.Queue(self, 'worker-queue', queue_name='worker-queue')

        worker_lambda_code = aws_lambda.AssetCode('backend/functions/worker')

        self.function_code = aws_lambda.Code.from_cfn_parameters()
        handler = 'handlers.handle_queue_event'
        if installation_mode == INSTALLATION_MODE_FULL:
            worker_lambda_code = self.function_code
            handler = 'backend/functions/worker/handlers.handle_queue_event'

        self.worker_lambda = aws_lambda.Function(
            self,
            'worker-lambda',
            code=worker_lambda_code,
            handler=handler,
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            environment={
                'ECS_CLUSTER_NAME': scope.base.cluster.cluster_name,
                'TASK_DEFINITION_ARN': self.worker_task_definition.task_definition_arn,
                'VPC_SUBNET': scope.base.vpc.private_subnets[0].subnet_id,
            },
            vpc=scope.base.vpc,
        )

        pass_role_iam_stmt = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
        )
        pass_role_iam_stmt.add_resources(
            self.worker_task_definition.task_role.role_arn,
            self.worker_task_definition.execution_role.role_arn
        )
        pass_role_iam_stmt.add_actions('iam:PassRole')
        self.worker_lambda.add_to_role_policy(pass_role_iam_stmt)

        run_task_iam_stmt = aws_iam.PolicyStatement(
            effect=aws_iam.Effect.ALLOW,
        )
        run_task_iam_stmt.add_resources(self.worker_task_definition.task_definition_arn)
        run_task_iam_stmt.add_actions('ecs:RunTask')
        self.worker_lambda.add_to_role_policy(run_task_iam_stmt)

        self.worker_queue.grant_consume_messages(self.worker_lambda.role)
        self.event_source_mapping = aws_lambda.EventSourceMapping(
            self,
            'worker-event-source-map',
            enabled=True,
            batch_size=10,
            event_source_arn=self.worker_queue.queue_arn,
            target=self.worker_lambda,
        )


class API(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.djangoSecret = aws_secretsmanager.Secret(self, 'django-secret')
        django_secret_key = aws_ecs.Secret.from_secrets_manager(self.djangoSecret)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        api_image = aws_ecs.ContainerImage.from_asset('backend/app')
        if installation_mode == INSTALLATION_MODE_FULL:
            tag_from_context = self.node.try_get_context('app_image_tag')
            tag = tag_from_context if tag_from_context is not 'undefined' else None
            api_image = aws_ecs.ContainerImage.from_ecr_repository(scope.base.app_registry, tag)

        env_map = {
            'DJANGO_SOCIAL_AUTH_AUTH0_KEY': 'django_social_auth_auth0_key_arn',
            'DJANGO_SOCIAL_AUTH_AUTH0_SECRET': 'django_social_auth_auth0_secret_arn',
            'DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN': 'django_social_auth_auth0_domain_arn',
            'DJANGO_USER_MGMT_BACKEND': 'django_user_mgmt_backend_arn',
            'DJANGO_USER_MGMT_AUTH0_DOMAIN': 'django_user_mgmt_auth0_domain_arn',
            'DJANGO_USER_MGMT_AUTH0_KEY': 'django_user_mgmt_auth0_key_arn',
            'DJANGO_USER_MGMT_AUTH0_SECRET': 'django_user_mgmt_auth0_secret_arn',
        }

        env = {k: self.map_secret(v) for k, v in env_map.items()}

        self.api = aws_ecs_patterns.LoadBalancedFargateService(
            self,
            'api-service',
            cluster=scope.base.cluster,
            image=api_image,
            desired_count=1,
            cpu=256,
            memory_limit_mib=512,
            container_name='backend',
            enable_logging=True,
            environment={
                'SQS_QUEUE_URL': scope.workers.worker_queue.queue_url,
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
                'POSTGRES_DB': DB_NAME,
            },
            container_port=8000,
            secrets={
                'DJANGO_SECRET_KEY': django_secret_key,
                **env,
            }
        )
        self.djangoSecret.grant_read(self.api.service.task_definition.task_role)

        scope.workers.worker_queue.grant_send_messages(self.api.service.task_definition.execution_role)
        scope.workers.worker_queue.grant_send_messages(self.api.service.task_definition.task_role)
        scope.base.db.secret.grant_read(self.api.service.task_definition.task_role)
        for k, v in env.items():
            self.grant_secret_access(v)

        self.api.service.connections.allow_to(scope.base.db.connections, aws_ec2.Port.tcp(5432))

    def map_secret(self, secret_arn):
        secret = aws_secretsmanager.Secret.from_secret_arn(
            self,
            secret_arn + '-secret',
            self.node.try_get_context(secret_arn)
        )
        return aws_ecs.Secret.from_secrets_manager(secret)

    def grant_secret_access(self, secret):
        secret.grant_read(self.api.service.task_definition.task_role)


class PublicAPI(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        self.function_code = aws_lambda.Code.from_cfn_parameters()
        public_api_lambda_code = aws_lambda.AssetCode('backend/functions/public_api')
        handler = 'handlers.handle'
        if installation_mode == INSTALLATION_MODE_FULL:
            public_api_lambda_code = self.function_code
            handler = 'backend/functions/public_api/handlers.handle'

        self.public_api_lambda = aws_lambda.Function(
            self,
            'public-api-lambda',
            code=public_api_lambda_code,
            handler=handler,
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            vpc=scope.base.vpc,
            environment={
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
            }
        )

        scope.base.db.secret.grant_read(self.public_api_lambda.role)

        self.publicApiGateway = aws_apigateway.RestApi(self, 'rest-api')
        self.publicApiLambdaIntegration = aws_apigateway.LambdaIntegration(self.public_api_lambda)
        self.publicApiGateway.root.add_method('GET', self.publicApiLambdaIntegration)


class CIPipeline(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        if installation_mode != INSTALLATION_MODE_FULL:
            self.node.add_error('Deploy of ci-pipeline stack is only available in `full` installation_mode. '
                                'Check your installation_mode in CDK context')

        # deploy to env pipeline
        self.pipeline = aws_codepipeline.Pipeline(
            self,
            'deploy-pipeline',
            pipeline_name='schema-cms-deploy-pipeline',
        )

        source_output = aws_codepipeline.Artifact()
        github_token_arn = self.node.try_get_context('github_token_arn')
        oauth_token = aws_secretsmanager.Secret.from_secret_arn(
            self,
            'gh-token',
            github_token_arn
        )

        pipeline_source_action = aws_codepipeline_actions.GitHubSourceAction(
            action_name='github_source',
            owner=GITHUB_REPO_OWNER,
            repo=GITHUB_REPOSITORY,
            branch='master',
            trigger=aws_codepipeline_actions.GitHubTrigger.WEBHOOK,
            output=source_output,
            oauth_token=oauth_token.secret_value,
        )

        self.pipeline.add_stage(
            stage_name='source',
            actions=[pipeline_source_action],
        )

        app_build_spec = aws_codebuild.BuildSpec.from_source_filename('buildspec-app.yaml')
        build_app_project = aws_codebuild.PipelineProject(
            self,
            'build_app_project',
            project_name='schema_cms_app_ci',
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    'REPOSITORY_URI': aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                    'PUSH_IMAGES': aws_codebuild.BuildEnvironmentVariable(
                        value='1'
                    ),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=app_build_spec,
        )
        scope.base.app_registry.grant_pull_push(build_app_project)

        build_app_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_app',
            input=source_output,
            project=build_app_project,
        )

        build_workers_project = aws_codebuild.PipelineProject(
            self,
            'build_workers_project',
            project_name='schema_cms_workers_ci',
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    'REPOSITORY_URI': aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.worker_registry.repository_uri
                    ),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=aws_codebuild.BuildSpec.from_source_filename('buildspec-worker.yaml'),
        )
        scope.base.worker_registry.grant_pull_push(build_workers_project)

        build_workers_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_workers',
            input=source_output,
            project=build_workers_project,
        )

        build_public_api_lambda_project = aws_codebuild.PipelineProject(
            self,
            'build_public_api_lambda_project',
            project_name='schema_cms_build_public_api',
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename('backend/functions/buildspec-public_api.yaml'),
        )

        public_api_lambda_build_output = aws_codepipeline.Artifact()
        build_public_api_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_public_api_lambda',
            input=source_output,
            project=build_public_api_lambda_project,
            outputs=[public_api_lambda_build_output]
        )

        build_workers_lambda_project = aws_codebuild.PipelineProject(
            self,
            'build_workers_lambda_project',
            project_name='schema_cms_build_workers',
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename('backend/functions/buildspec-worker.yaml'),
        )

        workers_lambda_build_output = aws_codepipeline.Artifact()
        build_workers_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_workers_lambda',
            input=source_output,
            project=build_workers_lambda_project,
            outputs=[workers_lambda_build_output]
        )

        build_cdk_project = aws_codebuild.PipelineProject(
            self,
            'build_cdk_project',
            project_name='schema_cms_stack_ci',
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename('buildspec-cdk.yaml'),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.CUSTOM)
        )

        cdk_artifact = aws_codepipeline.Artifact()
        build_cdk_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_stack',
            input=source_output,
            project=build_cdk_project,
            outputs=[cdk_artifact]
        )

        self.pipeline.add_stage(
            stage_name='build_app',
            actions=[
                build_app_action,
                build_workers_action,
                build_public_api_lambda_action,
                build_workers_lambda_action,
                build_cdk_action,
            ]
        )

        self.pipeline.add_stage(
            stage_name='deploy_public_api',
            actions=[
                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name='prepare_public_api_changes',
                    stack_name=scope.public_api.stack_name,
                    change_set_name='publicAPIStagedChangeSet',
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path('cdk.out/public-api.template.json'),
                    run_order=1,
                    parameter_overrides={
                        **scope.public_api.function_code.assign(
                            bucket_name=public_api_lambda_build_output.s3_location.bucket_name,
                            object_key=public_api_lambda_build_output.s3_location.object_key,
                            object_version=public_api_lambda_build_output.s3_location.object_version,
                        ),
                    },
                    extra_inputs=[
                        public_api_lambda_build_output,
                    ]
                ),

                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name='prepare_workers_changes',
                    stack_name=scope.workers.stack_name,
                    change_set_name='workersStagedChangeSet',
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path('cdk.out/workers.template.json'),
                    run_order=1,
                    parameter_overrides={
                        **scope.workers.function_code.assign(
                            bucket_name=workers_lambda_build_output.s3_location.bucket_name,
                            object_key=workers_lambda_build_output.s3_location.object_key,
                            object_version=workers_lambda_build_output.s3_location.object_version,
                        ),
                    },
                    extra_inputs=[
                        workers_lambda_build_output,
                    ]
                ),

                aws_codepipeline_actions.CloudFormationCreateReplaceChangeSetAction(
                    action_name='prepare_api_changes',
                    stack_name=scope.api.stack_name,
                    change_set_name='APIStagedChangeSet',
                    admin_permissions=True,
                    template_path=cdk_artifact.at_path('cdk.out/api.template.json'),
                    run_order=1,
                ),

                aws_codepipeline_actions.ManualApprovalAction(
                    action_name='approve_changes',
                    run_order=2,
                ),

                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name='execute_workers_changes',
                    stack_name=scope.workers.stack_name,
                    change_set_name='workersStagedChangeSet',
                    run_order=3,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name='execute_public_api_changes',
                    stack_name=scope.public_api.stack_name,
                    change_set_name='publicAPIStagedChangeSet',
                    run_order=3,
                ),

                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name='execute_api_changes',
                    stack_name=scope.api.stack_name,
                    change_set_name='APIStagedChangeSet',
                    run_order=4,
                ),
            ]
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
                # todo: remove line below
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PUSH)
                .and_branch_is('feature/ci-pipeline'),
            ],
        )

        self.app_ci_project = aws_codebuild.Project(
            self,
            'schema_cms_app_pr_build',
            project_name='schema_cms_app_ci',
            source=gh_source,
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    'REPOSITORY_URI': aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                    'PUSH_IMAGES': aws_codebuild.BuildEnvironmentVariable(
                        value='0',
                    ),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=app_build_spec,
        )
        scope.base.app_registry.grant_pull_push(self.app_ci_project.role)
