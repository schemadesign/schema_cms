from typing import List

from aws_cdk.aws_codebuild import (
    BuildSpec,
    Cache,
    LocalCacheMode,
    PipelineProject,
    BuildEnvironment,
    BuildEnvironmentVariable,
    LinuxBuildImage,
)
from aws_cdk.aws_codepipeline import IStage, Artifact
from aws_cdk.aws_codepipeline_actions import CodeBuildAction, CloudFormationCreateReplaceChangeSetAction
from aws_cdk.aws_ecr import Repository
from aws_cdk.core import Construct


class BackendCiConfig(Construct):
    input_artifact: Artifact = None
    cdk_artifact: Artifact = None

    def __init__(
        self, scope: Construct, id: str, stages: List[IStage], repo: Repository, input_artifact: Artifact, cdk_artifact: Artifact
    ):
        super().__init__(scope, id)

        self.cdk_artifact = cdk_artifact
        self.input_artifact = input_artifact
        build_project = self.create_build_project(repo)

        stages[1].add_action(self.create_build_action("backend", build_project))
        stages[2].add_action(self.create_create_change_set_action())

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

    def create_build_action(self, name: str, project: PipelineProject):
        return CodeBuildAction(action_name=f"build-{name}", project=project, input=self.input_artifact, run_order=1)

    def create_create_change_set_action(self):
        return CloudFormationCreateReplaceChangeSetAction(
            action_name="prepare-api-changes",
            stack_name="schema-cms-api",
            change_set_name="APIStagedChangeSet",
            admin_permissions=True,
            template_path=self.cdk_artifact.at_path("cdk.out/schema-cms-api.template.json"),
            run_order=2,
        )
