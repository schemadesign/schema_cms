from aws_cdk.core import Construct
from aws_cdk.aws_codepipeline import Artifact, Pipeline, StageProps
from aws_cdk.aws_codepipeline_actions import S3SourceAction, S3Trigger
from config.base import EnvSettings
from .entrypoint import CiEntrypoint
from .backend import BackendCiConfig
from .frontend import FrontendCiConfig


class CIPipeline(Construct):
    build_stage_name: str = "Build"
    deploy_stage_name: str = "Deploy"
    pipeline: Pipeline = None

    repos: dict = {}

    @staticmethod
    def get_output_artifact(env_settings: EnvSettings):
        return Artifact.artifact(name=f"{env_settings.project_name}-source")

    def __init__(self, scope: Construct, id: str, props: EnvSettings, entrypoint: CiEntrypoint, repos: dict):
        super().__init__(scope, id)

        self.pipeline = self.create_pipeline(props, entrypoint)
        self.configure_pipeline(self.pipeline, props, repos)

    def create_pipeline(self, props: EnvSettings, entrypoint: CiEntrypoint):
        pipeline = Pipeline(
            self,
            "Pipeline",
            pipeline_name=f"{props.project_name}-ci",
            stages=[
                StageProps(
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
                ),
                StageProps(stage_name=self.build_stage_name, actions=[]),
                # StageProps(stage_name=self.deploy_stage_name, actions=[])
            ],
        )

        return pipeline

    def configure_pipeline(self, pipeline: Pipeline, props: EnvSettings, repos: dict):
        source_output_artifact = CIPipeline.get_output_artifact(props)

        BackendCiConfig(
            self,
            "BackendConfig",
            pipeline.stages[1],
            # pipeline.stages[2],
            props,
            repos["app"],
            source_output_artifact,
        )

        FrontendCiConfig(self, "FrontendConfig", pipeline.stages[1], props, repos, source_output_artifact)
