from aws_cdk.aws_codebuild import PipelineProject, BuildEnvironment, LinuxBuildImage, BuildSpec
from aws_cdk.aws_codepipeline import IStage, Artifact
from aws_cdk.aws_codepipeline_actions import (
    CodeBuildAction,
    CloudFormationCreateReplaceChangeSetAction,
    CloudFormationExecuteChangeSetAction
)
from aws_cdk.aws_lambda import Code
from aws_cdk.core import Construct


class ImageResizeLambdaCiConfig(Construct):
    input_artifact: Artifact = None
    output: Artifact = Artifact()

    def __init__(
        self,
        scope: Construct,
        id: str,
        build_stage: IStage,
        input_artifact: Artifact,
    ):
        super().__init__(scope, id)
        build_project = self.create_build_project()

        build_stage.add_action(self.crate_build_action("image-resize-lambda", build_project, input_artifact))

    def create_build_project(self):
        project = PipelineProject(
            self,
            f"ImageResizeLambdaBuild",
            project_name=f"schema-cms-build-image-resize-lambda",
            environment=BuildEnvironment(build_image=LinuxBuildImage.STANDARD_3_0),
            build_spec=BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/image_resize.yaml"),
        )

        return project

    def crate_build_action(self, name: str, project: PipelineProject, input_artifact: Artifact):
        return CodeBuildAction(
            action_name=f"build-{name}",
            project=project,
            input=input_artifact,
            outputs=[self.output],
            run_order=1
        )

    def prepare_image_resize_lambda_changes(self, cdk_artifact: Artifact, function_code: Code):
        return CloudFormationCreateReplaceChangeSetAction(
            action_name="prepare-image-resize-lambda-changes",
            stack_name="schema-cms-image-resize",
            change_set_name="imageResizeLambdaStagedChangeSet",
            admin_permissions=True,
            template_path=cdk_artifact.at_path("infra/cdk.out/schema-cms-image-resize.template.json"),
            run_order=2,
            parameter_overrides={
                **function_code.assign(
                    bucket_name=self.output.s3_location.bucket_name,
                    object_key=self.output.s3_location.object_key,
                    object_version=self.output.s3_location.object_version,
                )
            },
            extra_inputs=[self.output],
        )

    @staticmethod
    def execute_image_resize_lambda_changes():
        return CloudFormationExecuteChangeSetAction(
                action_name="execute-image-resize-lambda_changes",
                stack_name="schema-cms-image-resize",
                change_set_name="imageResizeLambdaStagedChangeSet",
                run_order=3,
        )
