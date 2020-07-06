from aws_cdk.core import Construct, RemovalPolicy
from aws_cdk.aws_ecr import Repository

from config.base import EnvSettings


class BaseECR(Construct):
    backend_repository: Repository = None

    @staticmethod
    def get_backend_repository_name(env_settings: EnvSettings):
        return f"{env_settings.project_name}-app"

    @staticmethod
    def get_nginx_repository_name(env_settings: EnvSettings):
        return f"{env_settings.project_name}-nginx"

    @staticmethod
    def get_webapp_repository_name(env_settings: EnvSettings):
        return f"{env_settings.project_name}-webapp"

    def __init__(self, scope: Construct, id: str, props: EnvSettings):
        super().__init__(scope, id)

        self.backend_repository = Repository(
            self,
            "ECRBackendRepository",
            repository_name=self.get_backend_repository_name(props),
            removal_policy=RemovalPolicy.DESTROY,
        )
        self.nginx_repository = Repository(
            self,
            "ECRNginxRepository",
            repository_name=self.get_nginx_repository_name(props),
            removal_policy=RemovalPolicy.DESTROY,
        )
        self.webapp_repository = Repository(
            self,
            "ECRWebAppRepository",
            repository_name=self.get_webapp_repository_name(props),
            removal_policy=RemovalPolicy.DESTROY,
        )
