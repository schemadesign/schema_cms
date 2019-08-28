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
    create_sqs_queue &&
    echo "SQS QUEUE created"
} || {
    echo "SQS QUEUE NOT created"
}

WORKER_QUEUE_ARN=$(get_worker_queue_arn)

echo "Worker queue ARN: $WORKER_QUEUE_ARN"

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


# Worker lambda installation

{
    create_worker_lambda &&
    echo "Public API lambda function created"
} || {
    echo "Public API lambda function NOT created"
}

{
    create_worker_lambda_event_resource "$WORKER_QUEUE_ARN" &&
    echo "Worker lambda event source created"
} || {
    echo "Worker lambda event source NOT created"
}

echo "LocalStack fixtures installed"

python wait_for_postgres.py &&
               ./manage.py migrate &&
               ./manage.py runserver 0.0.0.0:8000
