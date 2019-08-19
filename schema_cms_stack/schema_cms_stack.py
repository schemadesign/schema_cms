from aws_cdk import core, aws_ec2, aws_sqs, aws_apigateway, aws_lambda, aws_ecs, aws_iam, aws_ecs_patterns, aws_rds


class BaseResources(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # self.registry = aws_ecr.Repository(self, 'images')
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
            engine=aws_rds.DatabaseInstanceEngine.POSTGRES,
            storage_encrypted=True,
            allocated_storage=50,
            instance_class=aws_ec2.InstanceType.of(aws_ec2.InstanceClass.BURSTABLE2, aws_ec2.InstanceSize.SMALL),
            vpc=self.vpc,
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
            image=aws_ecs.ContainerImage.from_asset('task_image'),
            logging=aws_ecs.AwsLogDriver(stream_prefix='worker-container'),
            environment={
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
            }
        )

        self.worker_queue = aws_sqs.Queue(self, 'worker-queue', queue_name='worker-queue')
        self.worker_lambda = aws_lambda.Function(
            self,
            'worker-lambda',
            code=aws_lambda.AssetCode('functions/worker'),
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

        self.api = aws_ecs_patterns.LoadBalancedFargateService(
            self,
            'api-service',
            cluster=scope.base.cluster,
            image=aws_ecs.ContainerImage.from_asset('backend'),
            desired_count=1,
            cpu=256,
            memory_limit_mib=512,
            container_name='backend',
            enable_logging=True,
            environment={
                'SQS_QUEUE_URL': scope.workers.worker_queue.queue_url,
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
            },
            container_port=5000,
        )

        scope.workers.worker_queue.grant_send_messages(self.api.service.task_definition.execution_role)
        scope.workers.worker_queue.grant_send_messages(self.api.service.task_definition.task_role)
        scope.base.db.secret.grant_read(self.api.service.task_definition.task_role)


class PublicAPI(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.publicApiLambda = aws_lambda.Function(
            self,
            'public-api-lambda',
            code=aws_lambda.AssetCode('functions/public_api'),
            handler='handlers.handle',
            runtime=aws_lambda.Runtime.PYTHON_3_7,
            vpc=scope.base.vpc,
            environment={
                'DB_SECRET_ARN': scope.base.db.secret.secret_arn,
            }
        )

        scope.base.db.secret.grant_read(self.publicApiLambda.role)

        self.publicApiGateway = aws_apigateway.RestApi(self, 'rest-api')
        self.publicApiLambdaIntegration = aws_apigateway.LambdaIntegration(self.publicApiLambda)
        self.publicApiGateway.root.add_method('GET', self.publicApiLambdaIntegration)
