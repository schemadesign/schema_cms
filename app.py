#!/usr/bin/env python3

from aws_cdk import core

from schema_cms_stack.schema_cms_stack import (
    API,
    LambdaWorker,
    Workers,
    BaseResources,
    PublicAPI,
    ImageResize,
    CIPipeline,
    CertsStack,
    INSTALLATION_MODE_FULL,
    INSTALLATION_MODE_CONTEXT_KEY,
)


class App(core.App):
    def __init__(self,  **kwargs) -> None:
        super().__init__(**kwargs)
        self.certs = CertsStack(self, 'certs')
        self.base = BaseResources(self, 'base')
        self.workers = Workers(self, 'workers')
        self.api = API(self, 'api')
        self.lambda_worker = LambdaWorker(self, 'lambda-worker')
        self.public_api = PublicAPI(self, 'public-api')
        self.image_resize_lambda = ImageResize(self, 'image-resize')
        installation_mode = self.node.try_get_context(INSTALLATION_MODE_CONTEXT_KEY)
        if installation_mode == INSTALLATION_MODE_FULL:
            self.ci_pipeline = CIPipeline(self, 'ci-pipeline')


app = App()

app.synth()
