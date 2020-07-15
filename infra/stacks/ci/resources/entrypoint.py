from aws_cdk.aws_codebuild import (
    Artifacts,
    BuildSpec,
    Cache,
    LocalCacheMode,
    Project,
    Source,
)
from aws_cdk.aws_s3 import Bucket
from aws_cdk.core import Construct

from config.base import EnvSettings


class CiEntrypoint(Construct):
    artifacts_bucket: Bucket = None
    code_build_project: Project = None

    @staticmethod
    def get_artifacts_name(envs: EnvSettings):
        return f"{envs.project_name}-entrypoint"

    @staticmethod
    def get_artifacts_identifier(envs: EnvSettings):
        return f"{envs.project_name}-entrypoint"

    def __init__(self, scope: Construct, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.artifacts_bucket = Bucket(self, "ArtifactsBucket", versioned=True)
        self.code_build_project = self.create_build_project(envs)

    def create_build_project(self, envs: EnvSettings):
        project = Project(
            self,
            "BuildEntrypoint",
            project_name="SchemaCMS",
            description="Run this project to deploy SchemaCMS selected version",
            cache=Cache.local(LocalCacheMode.SOURCE),
            build_spec=self.create_build_spec(),
            source=Source.git_hub(owner="schemadesign", repo="schema_cms",),
            artifacts=Artifacts.s3(
                identifier=self.get_artifacts_identifier(envs),
                name=self.get_artifacts_name(envs),
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
