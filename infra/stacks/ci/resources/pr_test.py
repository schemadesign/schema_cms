from aws_cdk import aws_codebuild
from aws_cdk.aws_ecr import Repository
from aws_cdk.core import Construct
from aws_cdk.aws_iam import PolicyStatement

from config.base import EnvSettings
from stacks.base.resources.ecr import BaseECR


class PRTestConfig(Construct):
    backend_spec = aws_codebuild.BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/app.yaml")
    frontend_spec = aws_codebuild.BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/frontend.yaml")

    def __init__(self, scope: Construct, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        backend_repo = self.retrieve_backend_ecr_repository(envs)
        nginx_repo = self.retrieve_nginx_ecr_repository(envs)
        webapp_repo = self.retrieve_webapp_ecr_repository(envs)

        self.ecr_repos = {"nginx": nginx_repo, "app": backend_repo, "webapp": webapp_repo}

        gh_source = aws_codebuild.Source.git_hub(
            owner="schemadesign",
            repo="schema_cms",
            webhook=True,
            webhook_filters=[
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PULL_REQUEST_CREATED),
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PULL_REQUEST_UPDATED),
                aws_codebuild.FilterGroup.in_event_of(aws_codebuild.EventAction.PULL_REQUEST_REOPENED),
            ],
        )

        self.app_ci_project = aws_codebuild.Project(
            self,
            "PRBackendBuild",
            project_name="schema-cms-pr-app-build",
            source=gh_source,
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=self.ecr_repos["app"].repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="0"),
                    "DOCKER_USERNAME": aws_codebuild.BuildEnvironmentVariable(
                        type=aws_codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value="DOCKER_USERNAME",
                    ),
                    "DOCKER_PASSWORD": aws_codebuild.BuildEnvironmentVariable(
                        type=aws_codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value="DOCKER_PASSWORD",
                    ),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=self.backend_spec,
        )

        self.ecr_repos["app"].grant_pull_push(self.app_ci_project)

        self.fe_ci_project = aws_codebuild.Project(
            self,
            "PRFrontendBuild",
            project_name="schema-cms-pr-fe-build",
            source=gh_source,
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "NGINX_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=self.ecr_repos["nginx"].repository_uri
                    ),
                    "APP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=self.ecr_repos["app"].repository_uri
                    ),
                    "WEBAPP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=self.ecr_repos["webapp"].repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="0"),
                    "DOCKER_USERNAME": aws_codebuild.BuildEnvironmentVariable(
                        type=aws_codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value="DOCKER_USERNAME",
                    ),
                    "DOCKER_PASSWORD": aws_codebuild.BuildEnvironmentVariable(
                        type=aws_codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value="DOCKER_PASSWORD",
                    ),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.CUSTOM),
            build_spec=self.frontend_spec,
        )

        for repo in self.ecr_repos.values():
            repo.grant_pull_push(self.fe_ci_project)

        self.fe_ci_project.add_to_role_policy(PolicyStatement(actions=["secretsmanager:*"], resources=["*"]))
        self.app_ci_project.add_to_role_policy(PolicyStatement(actions=["secretsmanager:*"], resources=["*"]))

    def retrieve_backend_ecr_repository(self, envs: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRBackendRepository", BaseECR.get_backend_repository_name(envs)
        )

    def retrieve_nginx_ecr_repository(self, envs: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRNginxRepository", BaseECR.get_nginx_repository_name(envs)
        )

    def retrieve_webapp_ecr_repository(self, envs: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRWebAppRepository", BaseECR.get_webapp_repository_name(envs)
        )
