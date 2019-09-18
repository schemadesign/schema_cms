#!/usr/bin/env bash

set -e

. $(dirname "$0")/install_localstack_fixtures.sh

# wait untill secretsmanager become ready
wait_for_secretsmanager
echo "Secrets manager is up"

# install all localstack fixtures
{
    install_db_secret &&
    echo "DB secrets set"
} || {
    echo "DB secrets NOT set"
}

{
    create_public_api_lambda &&
    echo "Public API lambda function created"
} || {
    echo "Public API lambda function NOT created"
}

LAMBDA_ARN=$(get_public_api_lambda_arn)

{
    create_rest_api &&
    echo "Public API rest api created"
} || {
    echo "Public API rest api NOT created"
}

{
    create_s3_bucket "datasources" &&
    echo "Scripts S3 bucket created"
} || {
    echo "Scripts S3 bucket NOT created"
}

{
    create_sqs_queue "worker" &&
    echo "SQS Queue worker created"
} || {
    echo "SQS Queue worker NOT created"
}

API_ID=$(get_rest_api_id)

API_ID=${API_ID:0:10}

PARENT_RESOURCE_ID=$(get_parent_resource_id "$API_ID")

{
  create_public_api_integration "$API_ID" "$PARENT_RESOURCE_ID" "$LAMBDA_ARN" &&
     echo "Public API integration created"
} || {
    echo "Public API integration NOT created"
}

{
  create_public_api_deployment "$API_ID" &&
    echo "Public API deployment created"
} || {
    echo "Public API deployment NOT created"
}


# Worker lambdas installation

{
    create_worker_success_lambda &&
    echo "Worker success lambda function created"
} || {
    echo "Worker success lambda function NOT created"
}

{
    create_worker_failure_lambda &&
    echo "Worker failure lambda function created"
} || {
    echo "Worker failure lambda function NOT created"
}

WORKER_SUCCESS_ARN=$(get_worker_success_lambda_arn)

{
  wait_for_stepfunctions &&
  create_state_machine "$WORKER_STATE_MACHINE_NAME" "$WORKER_SUCCESS_ARN" &&
  echo "Worker state machine created"
} || {
  echo "Worker state machine NOT created"
}

echo "LocalStack fixtures installed"

python wait_for_postgres.py &&
               ./manage.py migrate &&
               ./manage.py initialuser &&
               ./manage.py runserver 0.0.0.0:8000
