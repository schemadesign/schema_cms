from aws_cdk.aws_codepipeline import Artifact, Pipeline, StageProps
from aws_cdk.aws_codepipeline_actions import S3SourceAction, S3Trigger, ManualApprovalAction
from aws_cdk.core import Construct
from aws_cdk.aws_codebuild import PipelineProject

from config.base import EnvSettings
from .backend import BackendCiConfig
from .entrypoint import CiEntrypoint
from .frontend import FrontendCiConfig
from .workers import WorkersCiConfig
from .cdk import CDKConfig


class CIPipeline(Construct):
    build_stage_name: str = "Build"
    deploy_stage_name: str = "Deploy"
    pipeline: Pipeline = None

    repos: dict = {}

    @staticmethod
    def get_output_artifact():
        return Artifact.artifact(name=f"schema-cms-source")

    def __init__(
        self, scope: Construct, id: str, props: EnvSettings, entrypoint: CiEntrypoint, repos: dict, functions
    ):
        super().__init__(scope, id)

        self.pipeline = self.create_pipeline(props, entrypoint)
        self.configure_pipeline(self.pipeline, repos, functions)

    def create_pipeline(self, props: EnvSettings, entrypoint: CiEntrypoint):
        source_actions = [
            S3SourceAction(
                action_name=f"schema-cms-source",
                bucket=entrypoint.artifacts_bucket,
                bucket_key=entrypoint.get_artifacts_name(props),
                output=self.get_output_artifact(),
                trigger=S3Trigger.POLL,
            )
        ]

        pipeline = Pipeline(
            self,
            "Pipeline",
            pipeline_name=f"schema-cms-ci",
            stages=[
                StageProps(stage_name="Source", actions=source_actions,),
                StageProps(stage_name=self.build_stage_name, actions=[]),
                StageProps(stage_name=self.deploy_stage_name, actions=[
                    ManualApprovalAction(action_name="approve_changes", run_order=1)
                ])
            ],
        )

        return pipeline

    def configure_pipeline(self, pipeline: Pipeline, repos: dict, functions):
        source_output_artifact = CIPipeline.get_output_artifact()

        cdk_config = CDKConfig(self, "CDKConfig", pipeline.stages[1], source_output_artifact)

        BackendCiConfig(
            self, "BackendConfig", pipeline.stages, repos["app"], source_output_artifact, cdk_config.cdk_artifact
        )

        FrontendCiConfig(self, "FrontendConfig", pipeline.stages[1], repos, source_output_artifact)
        WorkersCiConfig(self, "WorkersConfig", pipeline.stages[1], source_output_artifact, functions)

