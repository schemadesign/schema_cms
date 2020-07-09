from typing import List

from aws_cdk.aws_codebuild import PipelineProject, BuildEnvironment, LinuxBuildImage, BuildSpec, Artifacts
from aws_cdk.aws_codepipeline import IStage
from aws_cdk.aws_codepipeline_actions import CodeBuildAction, CloudFormationCreateReplaceChangeSetAction
from aws_cdk.aws_lambda import Function
from aws_cdk.core import Construct


class WorkersCiConfig(Construct):
    input_artifact: Artifacts = None

    def __init__(
        self,
        scope: Construct,
        id: str,
        build_stage: IStage,
        input_artifact: Artifacts,
        functions: List[Function],
    ):
        super().__init__(scope, id)

        self.input_artifact = input_artifact
        build_projects = self.create_build_projects(functions)

        build_actions = []
        for project, function_name in build_projects:
            build_actions.append(
                build_stage.add_action(self.crate_build_action(function_name, project, self.input_artifact))
            )

    def create_build_projects(self, functions: List[Function]):
        projects = []

        for (function, code) in functions:
            function_name = self.get_function_base_name(function)
            project = PipelineProject(
                self,
                f"WorkerBuild-{function_name}",
                project_name=f"schema-cms-build-{function_name}",
                environment=BuildEnvironment(build_image=LinuxBuildImage.STANDARD_3_0),
                build_spec=BuildSpec.from_source_filename("backend/functions/buildspec-lambda-worker.yaml"),
            )

            projects.append((project, function_name))

        return projects

    @staticmethod
    def crate_build_action(name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(action_name=f"build-{name}", project=project, input=input_artifact, run_order=1)

    def prepare_workers_changes(self, build_actions):
        params_overrides = {}
        extra_inputs = []

        for (_, output, _, code) in build_actions:
            params_overrides.update(
                **code.assign(
                    bucket_name=output.s3_location.bucket_name,
                    object_key=output.s3_location.object_key,
                    object_version=output.s3_location.object_version,
                )
            )
            extra_inputs.append(output)

        return CloudFormationCreateReplaceChangeSetAction(
            action_name="prepare_worker_changes",
            stack_name="schema-cms-lambda-workers",
            change_set_name="lambdaWorkerStagedChangeSet",
            template_path=cdk_artifact.at_path("cdk.out/lambda-worker.template.json"),
            parameter_overrides=params_overrides,
            extra_inputs=extra_inputs,
            **change_set_kwargs,
        )

    @staticmethod
    def get_function_base_name(fn):
        return fn.to_string().split("/")[-1]
