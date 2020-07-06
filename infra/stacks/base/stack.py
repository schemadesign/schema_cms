from aws_cdk.core import App, Stack

from .resources.resources import BaseResources, BaseCodeCommit


class BaseResourcesStack(Stack):
    resources: BaseResources = None

    def __init__(self, scope: App, id: str, props):
        super().__init__(scope, id)

        self.resources = BaseResources(self, "BaseResources", props=props)


class CodeCommitStack(Stack):
    resources: BaseCodeCommit

    def __init__(self, scope: App, id: str, props):
        super().__init__(scope, id)

        self.resources = BaseCodeCommit(self, "BaseCodeCommit", props=props)
