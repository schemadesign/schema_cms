from aws_cdk.core import Construct
from aws_cdk.aws_codepipeline import Artifact, Pipeline
from aws_cdk.aws_codepipeline_actions import S3SourceAction, S3Trigger

from config.base import EnvSettings
from .entrypoint import CiEntrypoint


class CIPipeline(Construct):
    build_stage_name: str = "Build"
    deploy_stage_name: str = "Deploy"
    pipeline: Pipeline = None

    @staticmethod
    def get_output_artifact(env_settings: EnvSettings):
        return Artifact.artifact(name=f"{env_settings.project_name}-source")

    def __init__(self, scope: Construct, id: str, props: EnvSettings, entrypoint: CiEntrypoint):
        super().__init__(scope, id)

        self.pipeline = self.create_pipeline(props, entrypoint)

    def create_pipeline(self, props: EnvSettings, entrypoint: CiEntrypoint):
        pipeline = Pipeline(self, "Pipeline", pipeline_name=f"{props.project_name}-ci")

        pipeline.add_stage(
            stage_name="Source",
            actions=[
                S3SourceAction(
                    action_name=f"{props.project_name}-source",
                    bucket=entrypoint.artifacts_bucket,
                    bucket_key=entrypoint.get_artifacts_name(props),
                    output=self.get_output_artifact(props),
                    trigger=S3Trigger.POLL,
                )
            ],
        )

        return pipeline
