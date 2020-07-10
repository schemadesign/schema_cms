from aws_cdk.core import Construct
from aws_cdk import aws_codebuild


class PRTestConfig(Construct):
    backend_spec = aws_codebuild.BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/app.yaml")
    frontend_spec = aws_codebuild.BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/frontend.yaml")

    def __init__(self, scope: Construct, id: str, repos: dict):
        super().__init__(scope, id)

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
                        value=repos["app"].repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="0"),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER),
            build_spec=self.backend_spec,
        )

        repos["app"].grant_pull_push(self.app_ci_project)

        self.fe_ci_project = aws_codebuild.Project(
            self,
            "PRFrontendBuild",
            project_name="schema-cms-pr-fe-build",
            source=gh_source,
            environment=aws_codebuild.BuildEnvironment(
                environment_variables={
                    "NGINX_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=repos["nginx"].repository_uri
                    ),
                    "APP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=repos["app"].repository_uri
                    ),
                    "WEBAPP_REPOSITORY_URI": aws_codebuild.BuildEnvironmentVariable(
                        value=repos["webapp"].repository_uri
                    ),
                    "PUSH_IMAGES": aws_codebuild.BuildEnvironmentVariable(value="0"),
                },
                build_image=aws_codebuild.LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.CUSTOM),
            build_spec=self.frontend_spec,
        )

        for repo in repos.values():
            repo.grant_pull_push(self.fe_ci_project)
