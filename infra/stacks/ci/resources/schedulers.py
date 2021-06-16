from typing import List

from aws_cdk.aws_codebuild import PipelineProject, BuildEnvironment, LinuxBuildImage, BuildSpec
from aws_cdk.aws_codepipeline import IStage, Artifact
from aws_cdk.aws_codepipeline_actions import (
    CodeBuildAction,
    CloudFormationCreateReplaceChangeSetAction,
    CloudFormationExecuteChangeSetAction,
)
from aws_cdk.aws_lambda import Function
from aws_cdk.core import Construct

from config.base import EnvSettings


class SchedulersCiConfig(Construct):
    input_artifact: Artifact = None
    cdk_artifact = Artifact = None
    actions_with_outputs = []

    def __init__(
        self,
        scope: Construct,
        id: str,
        envs: EnvSettings,
        build_stage: IStage,
        input_artifact: Artifact,
        cdk_artifact: Artifact,
        functions: List[Function],
    ):
        super().__init__(scope, id)

        self.input_artifact = input_artifact
        self.cdk_artifact = cdk_artifact
        build_projects = self.create_build_projects(envs, functions)

        for project, function_name, code, function in build_projects:
            action, output = self.crate_build_action(function_name, project)
            build_stage.add_action(action)

            self.actions_with_outputs.append((action, output, code, function))

    def create_build_projects(self, envs: EnvSettings, functions: List[Function]):
        projects = []

        for (function, code) in functions:
            function_name = self.get_function_base_name(function)
            project = PipelineProject(
                self,
                f"SchedulerBuild-{function_name}",
                project_name=f"{envs.project_name}-build-{function_name}",
                environment=BuildEnvironment(build_image=LinuxBuildImage.STANDARD_3_0),
                build_spec=BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/schedulers.yaml"),
            )

            projects.append((project, function_name, code, function))

        return projects

    def crate_build_action(self, name: str, project: PipelineProject):
        output = Artifact()

        action = CodeBuildAction(
            action_name=f"build-{name}",
            project=project,
            input=self.input_artifact,
            outputs=[output],
            run_order=1,
        )

        return action, output

    def prepare_schedulers_changes(self, envs: EnvSettings, **change_set_kwargs):
        params_overrides = {}
        extra_inputs = []

        for action, output, code, function in self.actions_with_outputs:

            params_overrides.update(
                **code.assign(
                    bucket_name=output.s3_location.bucket_name,
                    object_version=output.s3_location.object_version,
                    object_key=output.s3_location.object_key,
                )
            )
            extra_inputs.append(output)

        return CloudFormationCreateReplaceChangeSetAction(
            action_name="prepare-schedulers-changes",
            stack_name=f"{envs.project_name}-schedulers",
            change_set_name="lambdaSchedulerStagedChangeSet",
            template_path=self.cdk_artifact.at_path("infra/cdk.out/schema-cms-schedulers.template.json"),
            parameter_overrides=params_overrides,
            extra_inputs=extra_inputs,
            **change_set_kwargs,
        )

    @staticmethod
    def execute_schedulers_changes(envs: EnvSettings):
        return CloudFormationExecuteChangeSetAction(
            action_name="execute-schedulers-changes",
            stack_name=f"{envs.project_name}-schedulers",
            change_set_name="lambdaSchedulerStagedChangeSet",
            run_order=5,
        )

    @staticmethod
    def get_function_base_name(fn):
        return fn.to_string().split("/")[-1]
