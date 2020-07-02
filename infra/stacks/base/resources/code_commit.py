from aws_cdk.core import Construct
from aws_cdk.aws_codecommit import Repository
from aws_cdk.aws_iam import User

from config.base import EnvSettings


class BaseCodeCommit(Construct):
    repository: Repository = None

    @staticmethod
    def get_repository_name(env_settings: EnvSettings):
        return f"{env_settings.project_name}-code"

    def __init__(self, scope: Construct, id: str, props: EnvSettings):
        super().__init__(scope, id)

        self.repository = Repository(
            self,
            "CodeRepo",
            repository_name=self.get_repository_name(props),
            description="Code mirror repository used to source CodePipeline",
        )

        user = User(self, "CodeRepoUser", user_name=f"{props.project_name}-code")

        self.repository.grant_pull_push(user)
