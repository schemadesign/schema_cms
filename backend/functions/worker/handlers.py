import os
import boto3


def handle_queue_event(event, context):
    for message in event.get("Records"):
        print("Received message")
        print(message)

        # run ECS task

        try:
            client = boto3.client("ecs")
            response = client.run_task(
                cluster=os.environ["ECS_CLUSTER_NAME"],
                launchType="FARGATE",
                taskDefinition=os.environ["TASK_DEFINITION_ARN"],
                count=1,
                platformVersion="LATEST",
                networkConfiguration={
                    "awsvpcConfiguration": {
                        "subnets": [os.environ["VPC_SUBNET"]],
                        "assignPublicIp": "DISABLED",
                    }
                },
            )
            print(str(response))
        except Exception as e:
            print("ERROR")
            print(e)
