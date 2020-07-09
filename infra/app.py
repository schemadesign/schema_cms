#!/usr/bin/env python3

from aws_cdk import core

from stacks.base.stack import BaseResourcesStack
from stacks.ci.stack import CiStack
from stacks.components.stack import ComponentsStack
from stacks.services.api.stack import ApiStack
from stacks.services.workers.stack import LambdaWorkerStack
from stacks.services.image_resize.stack import ImageResizeStack

from config.base import load_infra_envs


ENV_SETTINGS = load_infra_envs("../.project_config.json")


app = core.App()

base = BaseResourcesStack(app, "schema-cms-base", props=ENV_SETTINGS)
components = ComponentsStack(app, "schema-cms-components", props=ENV_SETTINGS)
api = ApiStack(
    app,
    "schema-cms-api",
    props=ENV_SETTINGS,
    queues=components.data_processing_queues,
    vpc=base.resources.vpc,
    db=base.resources.db,
)
image_resize = image_resize = ImageResizeStack(app, "schema-cms-image-resize", props=ENV_SETTINGS)
workers = LambdaWorkerStack(
    app, "schema-cms-lambda-workers", props=ENV_SETTINGS, queues=components.data_processing_queues,
)
pipeline = CiStack(app, "schema-cms-ci-cd", props=ENV_SETTINGS, functions=workers.functions)

app.synth()
