from typing import List
from aws_cdk.core import Construct
from aws_cdk.aws_codepipeline import IStage

from aws_cdk.aws_codebuild import PipelineProject, BuildEnvironment, LinuxBuildImage, BuildSpec, Artifacts
from aws_cdk.aws_codepipeline_actions import CodeBuildAction
from aws_cdk.aws_lambda import Function


class LambdasCiConfig(Construct):
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

        for project, function_name in build_projects:
            build_stage.add_action(self.crate_build_action(function_name, project, self.input_artifact))

    def create_build_projects(self, functions: List[Function]):
        projects = []

        for (function, code) in functions:
            function_name = self.get_function_base_name(function)
            project = PipelineProject(
                self,
                f"WorkerLambdaBuild-{function_name}",
                project_name=f"schema-cms-build-{function_name}",
                environment=BuildEnvironment(build_image=LinuxBuildImage.STANDARD_3_0),
                build_spec=BuildSpec.from_source_filename("backend/functions/buildspec-lambda-worker.yaml"),
            )

            projects.append((project, function_name))

        return projects

    @staticmethod
    def crate_build_action(name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(action_name=f"build-{name}", project=project, input=input_artifact)

    @staticmethod
    def get_function_base_name(fn):
        return fn.to_string().split("/")[-1]
