#!/usr/bin/env python3

from aws_cdk import core

from stacks.base.stack import CodeCommitStack
from stacks.ci.stack import CiStack
from config.base import load_infra_envs


ENV_SETTINGS = load_infra_envs("../.project_config.json")


def get_stack_name(base_name: str, prefix: str) -> str:
    return f"{prefix}-{base_name}"


app = core.App()

CodeCommitStack(app, get_stack_name("code-commit", ENV_SETTINGS.project_name), props=ENV_SETTINGS)
# BaseResourcesStack(app, "base", props=ENV_SETTINGS)
CiStack(app, get_stack_name("ci", ENV_SETTINGS.project_name), props=ENV_SETTINGS)

app.synth()

# class App(core.App):
#     def __init__(self, **kwargs) -> None:
#         super().__init__(**kwargs)
#         self.certs = CertsStack(self, "certs")
#         self.base = BaseResources(self, "base")
#         self.image_resize_lambda = ImageResize(self, "image-resize")
#         self.api = API(self, "api")
#         self.lambda_worker = LambdaWorker(self, "lambda-worker")
#         installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
#         if installation_mode == INSTALLATION_MODE_FULL:
#             self.ci_pipeline = CIPipeline(self, "ci-pipeline")
