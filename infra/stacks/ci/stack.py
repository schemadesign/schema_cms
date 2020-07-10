from typing import List

from aws_cdk.aws_ecr import Repository
from aws_cdk.aws_lambda import Function
from aws_cdk.core import App, Stack

from config.base import EnvSettings
from stacks.ci.resources.entrypoint import CiEntrypoint
from stacks.ci.resources.pipeline import CIPipeline
from ..base.resources.ecr import BaseECR


class CiStack(Stack):
    def __init__(self, scope: App, id: str, props: EnvSettings, functions: List[Function], ir_function: Function):
        super().__init__(scope, id)

        backend_repo = self.retrieve_backend_ecr_repository()
        nginx_repo = self.retrieve_nginx_ecr_repository()
        webapp_repo = self.retrieve_webapp_ecr_repository()

        ecr_repos = {"nginx": nginx_repo, "app": backend_repo, "webapp": webapp_repo}
        entrypoint = CiEntrypoint(self, "Entrypoint", props)

        CIPipeline(self, "PipelineConfig", props, entrypoint, ecr_repos, functions, ir_function)

    def retrieve_backend_ecr_repository(self):
        return Repository.from_repository_name(
            self, "ECRBackendRepository", BaseECR.get_backend_repository_name()
        )

    def retrieve_nginx_ecr_repository(self):
        return Repository.from_repository_name(
            self, "ECRNginxRepository", BaseECR.get_nginx_repository_name()
        )

    def retrieve_webapp_ecr_repository(self):
        return Repository.from_repository_name(
            self, "ECRWebAppRepository", BaseECR.get_webapp_repository_name()
        )
