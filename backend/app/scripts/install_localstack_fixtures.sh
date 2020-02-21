#!/bin/bash

set -e

SECRET_MANAGER_ENDPOINT_URL=http://localstack:4584
LAMBDA_EP=http://localstack:4574
API_GTW_EP=http://localstack:4567
S3_ENDPOINT_URL=http://localstack:4572
SQS_ENDPOINT_URL=http://localstack:4576
SES_ENDPOINT_URL=http://localstack:4579
STEP_FUNCTIONS_EP=http://localstack:4585
PUBLIC_API_FUNCTION_NAME=public-api
WORKER_SUCCESS_FUNCTION_NAME=worker-success
WORKER_FAILURE_FUNCTION_NAME=worker-failure
PUBLIC_API_GTW_NAME=rest-api
API_STAGE="test"
WORKER_STATE_MACHINE_NAME="workers-stm"
DB_SECRET_ARN="dbSecret"

function wait_for_secretsmanager {
  until aws --no-sign-request --endpoint-url="$SECRET_MANAGER_ENDPOINT_URL" secretsmanager list-secrets; do
    >&2 echo "Secretsmanager is unavailable - sleeping"
    sleep 1
  done
}

function wait_for_stepfunctions {
  until aws --no-sign-request --endpoint-url="$STEP_FUNCTIONS_EP" stepfunctions list-state-machines; do
    >&2 echo "Stepfunctions is unavailable - sleeping"
    sleep 1
  done
}

function wait_for_s3 {
  until aws --no-sign-request --endpoint-url="$S3_ENDPOINT_URL" s3 ls; do
    >&2 echo "S3 is unavailable - sleeping"
    sleep 1
  done
}

function wait_for_sqs {
  until aws --no-sign-request --endpoint-url="$SQS_ENDPOINT_URL" sqs list-queues; do
    >&2 echo "SQS is unavailable - sleeping"
    sleep 1
  done
}


function create_lambda_function() {
    aws --no-sign-request --endpoint-url=$LAMBDA_EP lambda create-function \
        --function-name "$1" \
        --code S3Bucket="__local__",S3Key="$2" \
        --handler "$3" \
        --runtime python3.7 \
        --role whatever
}

function get_lambda_arn() {
  aws \
    --no-sign-request \
    --endpoint-url=$LAMBDA_EP \
    lambda list-functions \
    --query "Functions[?FunctionName==\`$1\`].FunctionArn" \
    --output text \
    --region "$AWS_DEFAULT_REGION"
}


function create_worker_lambda() {
  cd ../functions/worker && \
  SLS_DEBUG=* node_modules/serverless/bin/serverless package --verbose --stage local && \
  cd ../../app
}

function create_public_api_lambda() {
  cd ../functions/public_api && \
  SLS_DEBUG=* node_modules/serverless/bin/serverless deploy --verbose --stage local && \
  cd ../../app
}

function create_image_handler_lambda() {
  cd ../functions/image-handler && \
  SLS_DEBUG=* serverless deploy --verbose --stage local && \
  cd ../../app
}

function get_public_api_lambda_arn {
    get_lambda_arn $PUBLIC_API_FUNCTION_NAME
}


function create_rest_api {
    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway create-rest-api \
        --region "$AWS_DEFAULT_REGION" \
        --name $PUBLIC_API_GTW_NAME
}

function get_rest_api_id {
  aws \
    --no-sign-request \
    --endpoint-url=$API_GTW_EP \
    apigateway get-rest-apis \
    --query "items[?name==\`$PUBLIC_API_GTW_NAME\`].id" \
    --output text \
    --region "$AWS_DEFAULT_REGION"
}

function get_parent_resource_id {
    aws \
    --no-sign-request \
    --endpoint-url=$API_GTW_EP \
    apigateway get-resources \
    --rest-api-id "$1" \
    --query 'items[?path==`/`].id' \
    --output text \
    --region "$AWS_DEFAULT_REGION"
}

function create_public_api_integration {
  aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway put-integration \
        --region "$AWS_DEFAULT_REGION" \
        --rest-api-id "$1" \
        --resource-id "$2" \
        --http-method GET \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri arn:aws:apigateway:$AWS_DEFAULT_REGION:lambda:path/2015-03-31/functions/$3/invocations \
        --passthrough-behavior WHEN_NO_MATCH
}

function create_public_api_deployment {
    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway create-deployment \
        --region "$AWS_DEFAULT_REGION" \
        --rest-api-id $1 \
        --stage-name $API_STAGE
}


function create_s3_bucket {
  aws --no-sign-request --endpoint-url=$S3_ENDPOINT_URL \
      --region $AWS_DEFAULT_REGION \
      s3 mb "s3://$1"
}


function put_bucket_versioning {
    aws --no-sign-request --endpoint-url=$S3_ENDPOINT_URL \
        --region $AWS_DEFAULT_REGION \
        s3api put-bucket-versioning --bucket $1 --versioning-configuration Status=Enabled
}

function create_sqs_queue {
  aws --no-sign-request --endpoint-url=$SQS_ENDPOINT_URL \
      --region $AWS_DEFAULT_REGION \
      sqs create-queue --queue-name "$1"
}
