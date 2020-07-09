
from aws_cdk.aws_codebuild import PipelineProject, BuildEnvironment, LinuxBuildImage, BuildSpec
from aws_cdk.aws_codepipeline import IStage, Artifact
from aws_cdk.aws_codepipeline_actions import CodeBuildAction
from aws_cdk.core import Construct


class ImageResizeLambdaCiConfig(Construct):
    input_artifact: Artifact = None
    image_resize_lambda_build_output: Artifact = Artifact()

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
            build_spec=BuildSpec.from_source_filename("backend/functions/buildspec-image-resize-lambda.yaml"),
        )

        return project

    def crate_build_action(self, name: str, project: PipelineProject, input_artifact: Artifact):
        return CodeBuildAction(
            action_name=f"build-{name}",
            project=project,
            input=input_artifact,
            outputs=[self.image_resize_lambda_build_output],
            run_order=1
        )
