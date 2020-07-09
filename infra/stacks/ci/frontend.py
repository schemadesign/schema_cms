from aws_cdk.core import Construct
from aws_cdk.aws_codebuild import (
    Artifacts,
    BuildSpec,
    Cache,
    LocalCacheMode,
    PipelineProject,
    BuildEnvironment,
    BuildEnvironmentVariable,
    LinuxBuildImage,
)
from aws_cdk.aws_codepipeline import IStage
from aws_cdk.aws_codepipeline_actions import CodeBuildAction

from config.base import EnvSettings


class FrontendCiConfig(Construct):
    def __init__(
        self, scope: Construct, id: str, build_stage: IStage, repos: dict, input_artifact: Artifacts,
    ):
        super().__init__(scope, id)

        build_project = self.create_build_project(repos)
        build_stage.add_action(self.create_build_action("frontend", build_project, input_artifact))

    def create_build_project(self, repos: dict):
        spec = BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/frontend.yaml")
        project = PipelineProject(
            self,
            "FrontendBuildProject",
            project_name=f"schema-cms-build-frontend",
            environment=BuildEnvironment(
                environment_variables={
                    "NGINX_REPOSITORY_URI": BuildEnvironmentVariable(value=repos["nginx"].repository_uri),
                    "APP_REPOSITORY_URI": BuildEnvironmentVariable(value=repos["app"].repository_uri),
                    "WEBAPP_REPOSITORY_URI": BuildEnvironmentVariable(value=repos["webapp"].repository_uri),
                    "PUSH_IMAGES": BuildEnvironmentVariable(value="1"),
                },
                build_image=LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            build_spec=spec,
            cache=Cache.local(LocalCacheMode.DOCKER_LAYER),
        )

        for repo in repos.values():
            repo.grant_pull_push(project)

        return project

    @staticmethod
    def create_build_action(name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(action_name=f"build-{name}", project=project, input=input_artifact, run_order=1)

    @staticmethod
    def create_deploy_action(name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(action_name=f"deploy-{name}", project=project, input=input_artifact)
