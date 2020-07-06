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
        self,
        scope: Construct,
        id: str,
        build_stage: IStage,
        props: EnvSettings,
        repos: dict,
        input_artifact: Artifacts,
    ):
        super().__init__(scope, id)

        build_project = self.create_build_project(props, repos)
        build_stage.add_action(self.create_build_action("frontend", build_project, input_artifact, props))

    def create_build_project(self, props: EnvSettings, repos: dict):
        spec = BuildSpec.from_source_filename("./buildspecs/frontend.yaml")
        project = PipelineProject(
            self,
            "FrontendBuildProject",
            project_name=f"{props.project_name}-build-frontend",
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
    def create_build_action(
        name: str, project: PipelineProject, input_artifact: Artifacts, props: EnvSettings
    ):
        return CodeBuildAction(
            action_name=f"{props.project_name}-build-{name}", project=project, input=input_artifact
        )

    @staticmethod
    def create_deploy_action(
        name: str, project: PipelineProject, input_artifact: Artifacts, props: EnvSettings
    ):
        return CodeBuildAction(
            action_name=f"{props.project_name}-deploy-{name}", project=project, input=input_artifact
        )
