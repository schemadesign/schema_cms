from typing import List

from aws_cdk.core import App, Stack
from aws_cdk.aws_sqs import Queue
from config.base import EnvSettings

from .queues import SQSComponent


class ComponentsStack(Stack):
    data_processing_queues: List[Queue] = None

    def __init__(self, scope: App, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.data_processing_queues = SQSComponent(self, "Queues", envs).queues_list
