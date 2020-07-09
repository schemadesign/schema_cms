from typing import List

from aws_cdk.core import Construct, Duration
from aws_cdk.aws_sqs import Queue, DeadLetterQueue

from config.base import EnvSettings


class SQSComponent(Construct):
    job_processing_max_retries: int = 3
    dead_letter_queue: DeadLetterQueue = None
    lambdas_sizes: str = None
    queues_list: List[Queue] = None

    def __init__(self, scope: Construct, id: str, props: EnvSettings):
        super().__init__(scope, id)

        self.lambdas_sizes = props.lambdas_sizes
        self.dead_letter_queue = self._create_job_processing_dead_letter_queue(props.project_name)
        self.queues_list = [
            self._create_job_processing_queue(props.project_name, size) for size in self.lambdas_sizes
        ]

    def _create_job_processing_queue(self, project_name: str, lambda_size: int):
        return Queue(
            self,
            f"DataProcessingQueue-{lambda_size}",
            queue_name=f"{project_name}-data-processing-{lambda_size}",
            visibility_timeout=Duration.seconds(300),
            dead_letter_queue=DeadLetterQueue(
                queue=self.dead_letter_queue, max_receive_count=self.job_processing_max_retries
            ),
        )

    def _create_job_processing_dead_letter_queue(self, project_name: str):
        return Queue(
            self,
            "DataProcessingDeadLetterQueue",
            queue_name=f"{project_name}-data-processing-dead-letter-queue",
        )
