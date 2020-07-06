from aws_cdk.core import App, Stack
from aws_cdk.aws_ecr import Repository
from aws_cdk.aws_codecommit import Repository as CCRepository

from config.base import EnvSettings
from ..base.resources.ecr import BaseECR
from ..base.resources.code_commit import BaseCodeCommit
from .entrypoint import CiEntrypoint
from .pipeline import CIPipeline


class CiStack(Stack):
    def __init__(self, scope: App, id: str, props):
        super().__init__(scope, id)

        backend_repo = self.retrieve_backend_ecr_repository(props)
        nginx_repo = self.retrieve_nginx_ecr_repository(props)
        webapp_repo = self.retrieve_webapp_ecr_repository(props)
        code_commit_repo = self.retrieve_code_commit_repository(props)

        repos = {"nginx": nginx_repo, "app": backend_repo, "webapp": webapp_repo}
        entrypoint = CiEntrypoint(self, "Entrypoint", props, code_commit_repo)

        CIPipeline(self, "PipelineConfig", props, entrypoint, repos)

    def retrieve_code_commit_repository(self, props: EnvSettings):
        return CCRepository.from_repository_name(self, "CodeRepo", BaseCodeCommit.get_repository_name(props))

    def retrieve_backend_ecr_repository(self, props: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRBackendRepository", BaseECR.get_backend_repository_name(props)
        )

    def retrieve_nginx_ecr_repository(self, props: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRNginxRepository", BaseECR.get_nginx_repository_name(props)
        )

    def retrieve_webapp_ecr_repository(self, props: EnvSettings):
        return Repository.from_repository_name(
            self, "ECRWebAppRepository", BaseECR.get_webapp_repository_name(props)
        )
