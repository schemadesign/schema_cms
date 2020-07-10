#!/usr/bin/env python3

from aws_cdk.core import App

from stacks.base.stack import BaseResourcesStack
from stacks.ci.stack import CiStack
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
        self.base = BaseResourcesStack(app, "schema-cms-base", props=ENV_SETTINGS)
        self.components = ComponentsStack(app, "schema-cms-components", props=ENV_SETTINGS)
        self.api = ApiStack(
            app,
            "schema-cms-api",
            props=ENV_SETTINGS,
            components=self.components,
            base_resources=self.base.resources,
        )
        self.image_resize = ImageResizeStack(app, "schema-cms-image-resize", props=ENV_SETTINGS)
        self.workers = LambdaWorkerStack(
            app, "schema-cms-workers", props=ENV_SETTINGS, components=self.component
        )

        installation_mode = self.node.try_get_context("installation_mode")

        if installation_mode == FULL_INSTALLATION_MODE:
            self.pipeline = CiStack(
                app,
                "schema-cms-cicd",
                props=ENV_SETTINGS,
                functions=self.workers.functions,
                ir_function=self.image_resize.function_code,
            )


app = App()

app.synth()
