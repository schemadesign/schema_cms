from aws_cdk.core import Construct

from .code_commit import BaseCodeCommit

# from .ecr import BaseECR
from config.base import EnvSettings


class BaseResources(Construct):
    code_commit: BaseCodeCommit = None
    ecr = None

    def __init__(self, scope: Construct, id: str, props: EnvSettings):
        super().__init__(scope, id)

        BaseCodeCommit(self, "CodeCommit", props)
        # ecr = BaseECR(self, "ECRBase", props)
