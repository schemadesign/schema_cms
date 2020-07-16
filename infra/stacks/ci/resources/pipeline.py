from aws_cdk.aws_codepipeline import Artifact, Pipeline, StageProps
from aws_cdk.aws_codepipeline_actions import S3SourceAction, S3Trigger, ManualApprovalAction
from aws_cdk.aws_ecr import Repository
from aws_cdk.core import Construct

from config.base import EnvSettings
from stacks.base.resources.ecr import BaseECR
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
    def get_output_artifact(envs: EnvSettings):
        return Artifact.artifact(name=f"{envs.project_name}-source")

    def __init__(
        self, scope: Construct, id: str, envs: EnvSettings, entrypoint: CiEntrypoint, functions, ir_function
    ):
        super().__init__(scope, id)

        backend_repo = self.retrieve_backend_ecr_repository(envs)
        nginx_repo = self.retrieve_nginx_ecr_repository(envs)
        webapp_repo = self.retrieve_webapp_ecr_repository(envs)

        self.ecr_repos = {"nginx": nginx_repo, "app": backend_repo, "webapp": webapp_repo}

        self.pipeline = self.create_pipeline(envs, entrypoint)
        self.configure_pipeline(envs, self.pipeline, functions, ir_function)

    def create_pipeline(self, envs: EnvSettings, entrypoint: CiEntrypoint):
        source_actions = [
            S3SourceAction(
                action_name=f"{envs.project_name}-source",
                bucket=entrypoint.artifacts_bucket,
                bucket_key=entrypoint.get_artifacts_name(envs),
                output=self.get_output_artifact(envs),
                trigger=S3Trigger.POLL,
            )
        ]

        pipeline = Pipeline(
            self,
            "Pipeline",
            pipeline_name=f"{envs.project_name}-pipeline",
            stages=[
                StageProps(stage_name="Source", actions=source_actions,),
                StageProps(stage_name=self.build_stage_name, actions=[]),
                StageProps(
                    stage_name=self.deploy_stage_name,
                    actions=[ManualApprovalAction(action_name="approve_changes", run_order=1)],
                ),
            ],
        )

        return pipeline

    def configure_pipeline(self, envs: EnvSettings, pipeline: Pipeline, functions, ir_function):
        source_output_artifact = CIPipeline.get_output_artifact(envs)
        build_stage = pipeline.stages[1]
        deploy_stage = pipeline.stages[2]

        cdk_config = CDKConfig(self, "CDKConfig", envs, build_stage, source_output_artifact)
        cdk_artifact = cdk_config.cdk_artifact

        api = ApiCiConfig(self, "ApiConfig", envs, build_stage, self.ecr_repos, source_output_artifact)
        image_resize = ImageResizeLambdaCiConfig(
            self, "ImageResizeConfig", envs, build_stage, source_output_artifact
        )
        workers = WorkersCiConfig(
            self, "WorkersConfig", envs, build_stage, source_output_artifact, cdk_artifact, functions
        )

        deploy_stage.add_action(api.prepare_api_changes(envs, cdk_artifact))
        deploy_stage.add_action(workers.prepare_workers_changes(envs, admin_permissions=True, run_order=2,))
        deploy_stage.add_action(
            image_resize.prepare_image_resize_lambda_changes(envs, cdk_artifact, ir_function)
        )
        deploy_stage.add_action(image_resize.execute_image_resize_lambda_changes(envs))
        deploy_stage.add_action(api.execute_api_changes(envs))
        deploy_stage.add_action(workers.execute_workers_changes(envs))

    def retrieve_backend_ecr_repository(self, envs: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRBackendRepository", BaseECR.get_backend_repository_name(envs)
        )

    def retrieve_nginx_ecr_repository(self, envs: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRNginxRepository", BaseECR.get_nginx_repository_name(envs)
        )

    def retrieve_webapp_ecr_repository(self, envs: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRWebAppRepository", BaseECR.get_webapp_repository_name(envs)
        )
