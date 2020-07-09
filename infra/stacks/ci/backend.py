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
from aws_cdk.aws_ecr import Repository
from aws_cdk.core import Construct


class BackendCiConfig(Construct):
    def __init__(
        self, scope: Construct, id: str, build_stage: IStage, repo: Repository, input_artifact: Artifacts,
    ):
        super().__init__(scope, id)

        build_project = self.create_build_project(repo)
        build_stage.add_action(self.create_build_action("backend", build_project, input_artifact))

    def create_build_project(self, repo: Repository):
        spec = BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/app.yaml")
        project = PipelineProject(
            self,
            "BackendBuildProject",
            project_name=f"schema-cms-build-backend",
            build_spec=spec,
            environment=BuildEnvironment(
                environment_variables={
                    "REPOSITORY_URI": BuildEnvironmentVariable(value=repo.repository_uri),
                    "PUSH_IMAGES": BuildEnvironmentVariable(value="1"),
                },
                build_image=LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            cache=Cache.local(LocalCacheMode.DOCKER_LAYER),
        )

        repo.grant_pull_push(project)

        return project

    @staticmethod
    def create_build_action(name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(action_name=f"build-{name}", project=project, input=input_artifact)

    @staticmethod
    def create_deploy_action(name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(action_name=f"deploy-{name}", project=project, input=input_artifact)
