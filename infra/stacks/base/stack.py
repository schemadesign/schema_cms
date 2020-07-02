from aws_cdk.core import App, Stack

from .resources.resources import BaseResources


class BaseStack(Stack):
    resources: BaseResources = None

    def __init__(self, scope: App, id: str, props):
        super().__init__(scope, id)

        self.resources = BaseResources(self, "BaseResources", props=props)
