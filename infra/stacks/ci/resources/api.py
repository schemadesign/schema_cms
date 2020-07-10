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
from aws_cdk.aws_codepipeline_actions import (
    CodeBuildAction,
    CloudFormationCreateReplaceChangeSetAction,
    CloudFormationExecuteChangeSetAction
)
from aws_cdk.aws_ecr import Repository
from aws_cdk.core import Construct


class ApiCiConfig(Construct):
    backend_spec: BuildSpec = BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/app.yaml")
    frontend_spec: BuildSpec = BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/frontend.yaml")
    input_artifact: Artifact = None

    def __init__(
            self, scope: Construct, id: str, build_stage: IStage, repos: List[Repository], input_artifact: Artifact
    ):
        super().__init__(scope, id)

        self.input_artifact = input_artifact

        backend_build_project = self.create_backend_build_project(repos["app"])
        front_build_project = self.create_front_build_project(repos)

        build_stage.add_action(self.create_build_action("backend", backend_build_project, order=1))
        build_stage.add_action(self.create_build_action("frontend", front_build_project, order=2))

    def create_backend_build_project(self, repo: Repository):
        project = PipelineProject(
            self,
            "BackendBuild",
            project_name=f"schema-cms-build-backend",
            build_spec=self.backend_spec,
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

    def create_front_build_project(self, repos: dict):
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
            build_spec=self.frontend_spec,
            cache=Cache.local(LocalCacheMode.DOCKER_LAYER),
        )

        for repo in repos.values():
            repo.grant_pull_push(project)

        return project

    def create_build_action(self, name: str, project: PipelineProject, order: int):
        return CodeBuildAction(action_name=f"build-{name}", project=project, input=self.input_artifact, run_order=order)

    @staticmethod
    def prepare_api_changes(cdk_artifact: Artifact):
        return CloudFormationCreateReplaceChangeSetAction(
            action_name="prepare-app-changes",
            stack_name="schema-cms-api",
            change_set_name="APIStagedChangeSet",
            admin_permissions=True,
            template_path=cdk_artifact.at_path("infra/cdk.out/schema-cms-api.template.json"),
            run_order=2,
        )

    @staticmethod
    def execute_api_changes():
        return CloudFormationExecuteChangeSetAction(
            action_name="execute-app-changes",
            stack_name="schema-cms-api",
            change_set_name="APIStagedChangeSet",
            run_order=3,
        )