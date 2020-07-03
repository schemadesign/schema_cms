from aws_cdk.core import Construct
from aws_cdk.aws_s3 import Bucket
from aws_cdk.aws_codecommit import IRepository
from aws_cdk.aws_codebuild import Artifacts, BuildSpec, Cache, LocalCacheMode, Project, Source
from aws_cdk.aws_events_targets import CodeBuildProject

from config.base import EnvSettings


class CiEntrypoint(Construct):
    artifacts_bucket: Bucket = None
    code_build_project: Project = None

    @staticmethod
    def get_artifacts_name(env_settings: EnvSettings):
        return f"{env_settings.project_name}-entrypoint"

    @staticmethod
    def get_artifacts_identifier(env_settings: EnvSettings):
        return f"{env_settings.project_name}-entrypoint"

    def __init__(self, scope: Construct, id: str, props: EnvSettings, repo: IRepository):
        super().__init__(scope, id)

        self.artifacts_bucket = Bucket(self, "ArtifactsBucket", versioned=True)
        self.code_build_project = self.create_build_project(props)
        repo.on_commit(
            "OnMasterCommit", branches=["master"], target=CodeBuildProject(self.code_build_project)
        )

    def create_build_project(self, props: EnvSettings, repo):
        project = Project(
            self,
            "Project",
            description=f"Run this project to deploy {props.env_stage} environment",
            cache=Cache.local(LocalCacheMode.SOURCE),
            source=Source.code_commit(repository=repo),
            artifacts=Artifacts.s3(
                identifier=self.get_artifacts_identifier(props),
                name=self.get_artifacts_name(props),
                bucket=self.artifacts_bucket,
                include_build_id=False,
                path="",
            ),
        )

        return project

    @staticmethod
    def create_build_spec():
        return BuildSpec.from_object(
            value={
                "version": "0.2",
                "phases": {"build": {"commands": ["make version > VERSION"]}},
                "artifacts": {"files": ["**/*"]},
            }
        )
