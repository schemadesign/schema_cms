from aws_cdk.aws_codepipeline import Artifact, Pipeline, StageProps
from aws_cdk.aws_codepipeline_actions import (
    CloudFormationCreateReplaceChangeSetAction,
    CloudFormationExecuteChangeSetAction
)
from aws_cdk.aws_codepipeline_actions import S3SourceAction, S3Trigger, ManualApprovalAction
from aws_cdk.core import Construct

from config.base import EnvSettings
from .api import ApiCiConfig
from .cdk import CDKConfig
from .entrypoint import CiEntrypoint
from .image_resize import ImageResizeLambdaCiConfig
from .workers import WorkersCiConfig


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
            pipeline_name=f"schema-cms-pipeline",
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
        build_stage = pipeline.stages[1]
        deploy_stage = pipeline.stages[2]

        cdk_config = CDKConfig(self, "CDKConfig", build_stage, source_output_artifact)
        cdk_artifact = cdk_config.cdk_artifact

        ApiCiConfig(self, "ApiConfig", build_stage, repos, source_output_artifact)
        ImageResizeLambdaCiConfig(self, "ImageResizeConfig", build_stage, source_output_artifact)
        workers = WorkersCiConfig(self, "WorkersConfig", build_stage, source_output_artifact, cdk_artifact, functions)

        deploy_stage.add_action(self.create_prepare_change_set_action(cdk_artifact))
        deploy_stage.add_action(self.create_execute_change_set_action(functions))
        deploy_stage.add_action(
            workers.prepare_workers_changes(
                admin_permissions=True,
                run_order=2,
            )
        )

    @staticmethod
    def create_prepare_change_set_action(cdk_artifact: Artifact):
        return CloudFormationCreateReplaceChangeSetAction(
            action_name="prepare-app-changes",
            stack_name="schema-cms-api",
            change_set_name="APIStagedChangeSet",
            admin_permissions=True,
            template_path=cdk_artifact.at_path("cdk.out/schema-cms-api.template.json"),
            run_order=2,
        )

    @staticmethod
    def create_execute_change_set_action():
        return CloudFormationExecuteChangeSetAction(
            action_name="execute-app-changes",
            stack_name="schema-cms-api",
            change_set_name="APIStagedChangeSet",
            run_order=3,
        )
