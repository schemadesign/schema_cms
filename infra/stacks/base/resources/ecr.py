from aws_cdk.core import Construct, RemovalPolicy
from aws_cdk.aws_ecr import Repository

from config.base import EnvSettings


class BaseECR(Construct):
    backend_repository: Repository = None

    @staticmethod
    def get_backend_repository_name(envs: EnvSettings):
        return f"{envs.project_name}-app"

    @staticmethod
    def get_nginx_repository_name(envs: EnvSettings):
        return f"{envs.project_name}-nginx"

    @staticmethod
    def get_webapp_repository_name(envs: EnvSettings):
        return f"{envs.project_name}-webapp"

    def __init__(self, scope: Construct, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.backend_repository = Repository(
            self,
            "BackendRepository",
            repository_name=self.get_backend_repository_name(envs),
            removal_policy=RemovalPolicy.DESTROY,
        )
        self.nginx_repository = Repository(
            self,
            "NginxRepository",
            repository_name=self.get_nginx_repository_name(envs),
            removal_policy=RemovalPolicy.DESTROY,
        )
        self.webapp_repository = Repository(
            self,
            "WebAppRepository",
            repository_name=self.get_webapp_repository_name(envs),
            removal_policy=RemovalPolicy.DESTROY,
        )
