#!/usr/bin/env bash

set -e

. $(dirname "$0")/install_localstack_fixtures.sh

# wait untill secretsmanager become ready
wait_for_secretsmanager
echo "Secrets manager is up"

# install all localstack fixtures

#install_db_secret

{
    create_s3_bucket "schemacms-images" &&
    echo "Scripts S3 bucket created"
} || {
    echo "Scripts S3 bucket NOT created"
}

{
    create_s3_bucket "schemacms" &&
    echo "Scripts S3 bucket created"
} || {
    echo "Scripts S3 bucket NOT created"
}

{
    put_bucket_versioning "schemacms" &&
    echo "Scripts S3 put bucket versioning done"
} || {
    echo "Scripts S3 put bucket versioning failed"
}

{
    create_sqs_queue "schemacms-queue" &&
    echo "SQS Queue worker created"
} || {
    echo "SQS Queue worker NOT created"
}

# ECS task with lambdas worker callbacks was replaced by single lambda worker
# Worker lambdas installation
#{
#    create_worker_success_lambda &&
#    echo "Worker success lambda function created"
#} || {
#    echo "Worker success lambda function NOT created"
#}
#
#{
#    create_worker_failure_lambda &&
#    echo "Worker failure lambda function created"
#} || {
#    echo "Worker failure lambda function NOT created"
#}

#WORKER_SUCCESS_ARN=$(get_worker_success_lambda_arn)

#{
#  wait_for_stepfunctions &&
#  create_state_machine "$WORKER_STATE_MACHINE_NAME" "$WORKER_SUCCESS_ARN" &&
#  echo "Worker state machine created"
#} || {
#  echo "Worker state machine NOT created"
#}

#{
#    create_worker_lambda &&
#    echo "Worker-Lambda function created"
#} || {
#    echo "Worker-Lambda function NOT created"
#}

#{
#    create_public_api_lambda &&
#    echo "Public-API function created"
#} || {
#    echo "Public-API function NOT created"
#}

echo "LocalStack fixtures installed"

python wait_for_postgres.py &&
               ./manage.py migrate &&
               ./manage.py initialuser
               ./manage.py loadscripts &&
               ./manage.py runserver 0.0.0.0:8000
