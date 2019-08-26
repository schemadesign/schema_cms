from aws_cdk import core, aws_ec2, aws_sqs, aws_apigateway, aws_lambda, aws_ecs, aws_iam, aws_ecs_patterns, aws_rds,\
    aws_secretsmanager, aws_codebuild, aws_ecr, aws_codepipeline, aws_codepipeline_actions

DB_NAME = 'gistdb'


class BaseResources(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.app_registry = aws_ecr.Repository(self, 'schema-cms-app-ecr', repository_name='schema-cms-app')
        self.worker_registry = aws_ecr.Repository(self, 'schema-cms-worker-ecr', repository_name='schema-cms-worker')

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

        self.worker_container = self.worker_task_definition.add_container(
            'worker',
            image=aws_ecs.ContainerImage.from_asset('backend/worker'),
            logging=aws_ecs.AwsLogDriver(stream_prefix='worker-container'),
            environment={
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
                'POSTGRES_DB': 'gistdb'
            }
        )

        self.worker_queue = aws_sqs.Queue(self, 'worker-queue', queue_name='worker-queue')
        self.worker_lambda = aws_lambda.Function(
            self,
            'worker-lambda',
            code=aws_lambda.AssetCode('backend/functions/worker'),
            handler='handlers.handle_queue_event',
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
        tag_from_context = self.node.try_get_context('app_image_tag')
        tag = tag_from_context if tag_from_context is not 'undefined' else None
        self.api = aws_ecs_patterns.LoadBalancedFargateService(
            self,
            'api-service',
            cluster=scope.base.cluster,
            # image=aws_ecs.ContainerImage.from_asset('backend/app'),
            image=aws_ecs.ContainerImage.from_ecr_repository(scope.base.app_registry, tag),
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
            }
        )
        self.djangoSecret.grant_read(self.api.service.task_definition.task_role)

        scope.workers.worker_queue.grant_send_messages(self.api.service.task_definition.execution_role)
        scope.workers.worker_queue.grant_send_messages(self.api.service.task_definition.task_role)
        scope.base.db.secret.grant_read(self.api.service.task_definition.task_role)
        # scope.base.registry.grant_pull_push(self.api.service.task_definition.task_role)
        self.api.service.connections.allow_to(scope.base.db.connections, aws_ec2.Port.tcp(5432))


class PublicAPI(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.function_code = aws_lambda.Code.from_cfn_parameters()
        self.public_api_lambda = aws_lambda.Function(
            self,
            'public-api-lambda',
            # code=aws_lambda.AssetCode('backend/functions/public_api'),
            code=self.function_code,
            handler='backend/functions/public_api/handlers.handle',
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

        self.pipeline = aws_codepipeline.Pipeline(
            self,
            'ci-pipeline',
            pipeline_name='schema-cms-pipeline',
        )

        source_output = aws_codepipeline.Artifact()
        # todo: pass ARN somehow
        oauth_token = aws_secretsmanager.Secret.from_secret_arn(
            self,
            'gh-token',
            'arn:aws:secretsmanager:eu-central-1:314820667159:secret:github-token-TRQAXN'
        )

        pipeline_source_action = aws_codepipeline_actions.GitHubSourceAction(
            action_name='github_source',
            owner='schemadesign',
            repo='schema_cms',
            # todo: update branch name
            branch='feature/CMS-5_infra-setup',
            trigger=aws_codepipeline_actions.GitHubTrigger.WEBHOOK,
            output=source_output,
            oauth_token=oauth_token.secret_value,
        )

        self.pipeline.add_stage(
            stage_name='source',
            actions=[pipeline_source_action],
        )

        build_app_project = aws_codebuild.PipelineProject(
            self,
            'build_app_project',
            project_name='schema_cms_app_ci',
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    'REPOSITORY_URI': aws_codebuild.BuildEnvironmentVariable(
                        value=scope.base.app_registry.repository_uri
                    ),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=aws_codebuild.BuildSpec.from_source_filename('buildspec-app.yaml'),
        )
        scope.base.app_registry.grant_pull_push(build_app_project)

        build_app_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_app',
            input=source_output,
            project=build_app_project,
        )

        build_worker_project = aws_codebuild.PipelineProject(
            self,
            'build_worker_project',
            project_name='schema_cms_worker_ci',
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
        scope.base.worker_registry.grant_pull_push(build_worker_project)

        build_worker_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_worker',
            input=source_output,
            project=build_worker_project,
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

        lambda_build_output = aws_codepipeline.Artifact()
        build_public_api_lambda_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_public_api_lambda',
            input=source_output,
            project=build_public_api_lambda_project,
            outputs=[lambda_build_output]
        )

        build_cloudformation_project = aws_codebuild.PipelineProject(
            self,
            'build_cloudformation_project',
            project_name='schema_cms_stack_ci',
            environment=aws_codebuild.BuildEnvironment(
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
            ),
            build_spec=aws_codebuild.BuildSpec.from_source_filename('buildspec-cdk.yaml'),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.CUSTOM)
        )

        cdk_artifact = aws_codepipeline.Artifact()
        build_cloudformation_action = aws_codepipeline_actions.CodeBuildAction(
            action_name='build_stack',
            input=source_output,
            project=build_cloudformation_project,
            outputs=[cdk_artifact]
        )

        self.pipeline.add_stage(
            stage_name='build_app',
            actions=[
                build_app_action,
                build_worker_action,
                build_public_api_lambda_action,
                build_cloudformation_action,
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
                            bucket_name=lambda_build_output.s3_location.bucket_name,
                            object_key=lambda_build_output.s3_location.object_key,
                            object_version=lambda_build_output.s3_location.object_version,
                        ),
                    },
                    extra_inputs=[
                        lambda_build_output,
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
                    action_name='execute_public_api_changes',
                    stack_name=scope.public_api.stack_name,
                    change_set_name='publicAPIStagedChangeSet',
                    run_order=3,
                ),
                aws_codepipeline_actions.CloudFormationExecuteChangeSetAction(
                    action_name='execute_api_changes',
                    stack_name=scope.api.stack_name,
                    change_set_name='APIStagedChangeSet',
                    run_order=3,
                ),
            ]
        )
