#!/usr/bin/env python3

from aws_cdk import core

from schema_cms_stack.schema_cms_stack import API, Workers, BaseResources, PublicAPI


class App(core.App):
    def __init__(self,  **kwargs) -> None:
        super().__init__(**kwargs)
        self.base = BaseResources(self, 'base')
        self.workers = Workers(self, 'workers')
        self.api = API(self, 'api')
        self.publicApi = PublicAPI(self, 'public-api')


app = App()

app.synth()
