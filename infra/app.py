#!/usr/bin/env python3

from aws_cdk.core import App

from stacks.base.stack import BaseResourcesStack
from stacks.ci.stack import CiStack, PRTestStack
from stacks.components.stack import ComponentsStack
from stacks.services.api.stack import ApiStack
from stacks.services.workers.stack import LambdaWorkerStack
from stacks.services.image_resize.stack import ImageResizeStack

from config.base import load_infra_envs


ENV_SETTINGS = load_infra_envs("../.project_config.json")
FULL_INSTALLATION_MODE = "full"


class App(App):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.base = BaseResourcesStack(self, "schema-cms-base", envs=ENV_SETTINGS)
        self.components = ComponentsStack(self, "schema-cms-components", envs=ENV_SETTINGS)
        self.api = ApiStack(
            self,
            "schema-cms-api",
            envs=ENV_SETTINGS,
            components=self.components,
            base_resources=self.base.resources,
        )
        self.image_resize = ImageResizeStack(self, "schema-cms-image-resize", envs=ENV_SETTINGS)
        self.workers = LambdaWorkerStack(
            self, "schema-cms-workers", envs=ENV_SETTINGS, components=self.components
        )

        installation_mode = self.node.try_get_context("installation_mode")

        if installation_mode == FULL_INSTALLATION_MODE:
            self.pipeline = CiStack(
                self,
                "schema-cms-cicd",
                envs=ENV_SETTINGS,
                functions=self.workers.functions,
                ir_function=self.image_resize.function_code,
            )
            self.repo_pr_checks = PRTestStack(self, "schema-cms-pr-checks", envs=ENV_SETTINGS)


app = App()

app.synth()
