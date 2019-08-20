#!/usr/bin/env python3

from aws_cdk import core

from schema_cms_stack.schema_cms_stack import API, Workers, BaseResources, PublicAPI, CIPipeline


class App(core.App):
    def __init__(self,  **kwargs) -> None:
        super().__init__(**kwargs)
        self.base = BaseResources(self, 'base')
        self.workers = Workers(self, 'workers')
        self.api = API(self, 'api')
        self.public_api = PublicAPI(self, 'public-api')
        self.ci_pipeline = CIPipeline(self, 'ci-pipeline')


app = App()

app.synth()
