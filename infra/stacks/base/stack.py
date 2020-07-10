from aws_cdk.core import App, Stack

from .resources.resources import BaseResources

from config.base import EnvSettings


class BaseResourcesStack(Stack):
    resources: BaseResources = None

    def __init__(self, scope: App, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.resources = BaseResources(self, "BaseResources", envs)
