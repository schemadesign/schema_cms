from rest_framework import response, status, views

import os
import boto3
import time

sfn_client = boto3.client('stepfunctions')


class HomeView(views.APIView):
    permission_classes = []

    def get(self, request):
        return response.Response(status=status.HTTP_200_OK)

    def post(self, request):
        sfn_client.start_execution(
            stateMachineArn=os.environ.get('WORKER_STM_ARN', None),
            name='test_execution_' + str(time.time()),
            input='null',
        )
        return response.Response(status=status.HTTP_200_OK)
