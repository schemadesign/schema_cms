from aws_cdk.aws_codebuild import (
    Artifacts,
    BuildSpec,
    Cache,
    LocalCacheMode,
    PipelineProject,
    BuildEnvironment,
    LinuxBuildImage,
)
from aws_cdk.aws_codepipeline import IStage, Artifact
from aws_cdk.aws_codepipeline_actions import CodeBuildAction
from aws_cdk.core import Construct


class CDKConfig(Construct):
    build_action: CodeBuildAction = None
    cdk_artifact: Artifact = Artifact()

    def __init__(
            self, scope: Construct, id: str, build_stage: IStage, input_artifact: Artifacts,
    ):
        super().__init__(scope, id)

        project = PipelineProject(
            self,
            "CDKStackBuild",
            project_name="schema-cms-build-stack",
            environment=BuildEnvironment(
                build_image=LinuxBuildImage.STANDARD_2_0,
                privileged=True,
            ),
            build_spec=BuildSpec.from_source_filename("./infra/stacks/ci/buildspecs/cdk.yaml"),
            cache=Cache.local(LocalCacheMode.CUSTOM),
        )

        self.build_action = self.create_build_action("stack", project, input_artifact)
        build_stage.add_action(self.build_action)

    def create_build_action(self, name: str, project: PipelineProject, input_artifact: Artifacts):
        return CodeBuildAction(
            action_name=f"build-{name}",
            project=project,
            input=input_artifact,
            outputs=[self.cdk_artifact],
            extra_inputs=[],
            run_order=3
        )
