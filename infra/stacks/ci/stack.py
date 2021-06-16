from typing import List

from aws_cdk.aws_lambda import Function
from aws_cdk.core import App, Stack

from config.base import EnvSettings
from stacks.ci.resources.entrypoint import CiEntrypoint
from stacks.ci.resources.pipeline import CIPipeline
from stacks.ci.resources.pr_test import PRTestConfig


class CiStack(Stack):
    def __init__(
        self,
        scope: App,
        id: str,
        envs: EnvSettings,
        functions: List[Function],
        schedulers: List[Function],
        ir_function: Function,
    ):
        super().__init__(scope, id)

        entrypoint = CiEntrypoint(self, "Entrypoint", envs)

        CIPipeline(self, "PipelineConfig", envs, entrypoint, functions, schedulers, ir_function)


class PRTestStack(Stack):
    def __init__(self, scope: App, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        PRTestConfig(self, "PRBuildConfig", envs)
