from typing import List, Tuple

from aws_cdk.aws_events import Rule, Schedule
from aws_cdk.aws_events_targets import LambdaFunction
from aws_cdk.aws_lambda import Code, Function, Runtime, Tracing
from aws_cdk.aws_secretsmanager import Secret
from aws_cdk.aws_ssm import StringParameter
from aws_cdk.core import App, Stack, Duration, Fn
from config.base import EnvSettings
from stacks.services.api.stack import ApiStack


class LambdaSchedulerStack(Stack):
    backend_url: str = ""
    lambda_auth_token: Secret = None
    functions: List[Tuple[Function, Code]] = None

    def __init__(self, scope: App, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.backend_domain_name = StringParameter.from_string_parameter_name(
            self, "DomainNameParameter", string_parameter_name="/schema-cms-app/DOMAIN_NAME"
        ).string_value

        self.backend_url = f"https://{self.backend_domain_name}/api/v1/"

        self.lambda_auth_token = Secret.from_secret_arn(
            self,
            id="lambda-auth-token",
            secret_arn=Fn.import_value(ApiStack.get_lambda_auth_token_arn_output_export_name(envs)),
        )

        self.functions = self._create_schedulers(envs)

    def _create_schedulers(self, envs: EnvSettings):
        is_app_only = self.node.try_get_context("is_app_only")

        if is_app_only == "true":
            code = Code.from_asset(path="../backend/functions/worker/.serverless/main.zip")
        else:
            code = Code.from_cfn_parameters()

        auto_refresh_scheduler = Function(
            self,
            "data-processing-auto-refresh-scheduler",
            function_name=f"{envs.project_name}-data-processing-auto-refresh-scheduler",
            code=code,
            runtime=Runtime.PYTHON_3_8,
            handler="schedulers.refresh_datasources_data",
            environment={
                "BACKEND_URL": self.backend_url,
                "LAMBDA_AUTH_TOKEN": self.lambda_auth_token.secret_value.to_string(),
            },
            memory_size=128,
            timeout=Duration.seconds(120),
            tracing=Tracing.ACTIVE,
        )

        clear_old_jobs = Function(
            self,
            "data-processing-clear-old-jobs-scheduler",
            function_name=f"{envs.project_name}-data-processing-clear-old-jobs-scheduler",
            code=code,
            runtime=Runtime.PYTHON_3_8,
            handler="schedulers.clear_old_jobs",
            environment={
                "BACKEND_URL": self.backend_url,
                "LAMBDA_AUTH_TOKEN": self.lambda_auth_token.secret_value.to_string(),
            },
            memory_size=128,
            timeout=Duration.seconds(120),
            tracing=Tracing.ACTIVE,
        )

        auto_refresh_rule = Rule(self, "auto-refresh-rule", schedule=Schedule.expression("cron(0 4 * * ? *)"))
        clear_old_jobs_rule = Rule(self, "clear-old-jobs", schedule=Schedule.expression("cron(0 5 * * ? *)"))

        auto_refresh_rule.add_target(LambdaFunction(auto_refresh_scheduler))
        clear_old_jobs_rule.add_target(LambdaFunction(clear_old_jobs))

        return [(auto_refresh_rule, code), (clear_old_jobs_rule, code)]
