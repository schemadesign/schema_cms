#!/usr/bin/env bash

set -e

SECRET_MANAGER_ENDPOINT_URL=http://localstack:4584
LAMBDA_EP=http://localstack:4574
API_GTW_EP=http://localstack:4567
S3_ENDPOINT_URL=http://localstack:4572
SQS_ENDPOINT_URL=http://localstack:4576
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

function install_db_secret {
    aws --endpoint-url="$SECRET_MANAGER_ENDPOINT_URL" secretsmanager create-secret \
        --name "$DB_SECRET_ARN" \
        --secret-string file://./scripts/dev/db-secret.json
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

function create_public_api_lambda {
  create_lambda_function $PUBLIC_API_FUNCTION_NAME "/app/functions/public_api" "handlers.handle"
}

function get_public_api_lambda_arn {
    get_lambda_arn $PUBLIC_API_FUNCTION_NAME
}

function get_worker_success_lambda_arn {
    get_lambda_arn $WORKER_SUCCESS_FUNCTION_NAME
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

function create_worker_success_lambda {
  create_lambda_function $WORKER_SUCCESS_FUNCTION_NAME "/app/functions/worker_success" "handlers.handle"
}

function create_worker_failure_lambda {
  create_lambda_function $WORKER_FAILURE_FUNCTION_NAME "/app/functions/worker_failure" "handlers.handle"
}

function create_state_machine {
  aws --no-sign-request --endpoint-url=$STEP_FUNCTIONS_EP \
      --region $AWS_DEFAULT_REGION \
      stepfunctions create-state-machine \
      --name "$1" \
      --role-arn arn:aws:iam::000000000000:role/service-role/MyRole \
      --definition "{
      \"StartAt\": \"call-success\",
      \"Version\": \"1.0\",
      \"TimeoutSeconds\": 60,
      \"States\": {
          \"call-success\": {
              \"Resource\": \"$2\",
              \"Type\": \"Task\",
              \"End\": true
          }
      }
  }"
}

function get_state_machine_arn {
  aws --no-sign-request --endpoint-url=$STEP_FUNCTIONS_EP \
      --region $AWS_DEFAULT_REGION \
      stepfunctions list-state-machines \
      --query "stateMachines[?name==\'$1\'].stateMachineArn"
      --output text
}

function create_s3_bucket {
  aws --no-sign-request --endpoint-url=$S3_ENDPOINT_URL \
      --region $AWS_DEFAULT_REGION \
      s3 mb "s3://$1"
}

function create_sqs_queue {
  aws --no-sign-request --endpoint-url=$SQS_ENDPOINT_URL \
      --region $AWS_DEFAULT_REGION \
      sqs create-queue --queue-name "$1"
}

#{
#    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway create-resource \
#        --region ${AWS_DEFAULT_REGION} \
#        --rest-api-id ${API_ID} \
#        --parent-id ${PARENT_RESOURCE_ID} \
#        --path-part "{somethingId}" &&
#    echo "Public API resource created"
#} || {
#    echo "Public API resource NOT created"
#}

#RESOURCE_ID=$(aws \
#    --no-sign-request --endpoint-url=$API_GTW_EP \
#    apigateway get-resources \
#    --rest-api-id ${API_ID} \
#    --query 'items[?path==`/{somethingId}`].id' \
#    -output text \
#    --region ${AWS_DEFAULT_REGION})

#{
#    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway put-method \
#        --region $AWS_DEFAULT_REGION \
#        --rest-api-id $API_ID \
#        --resource-id $RESOURCE_ID \
#        --http-method GET \
#        --request-parameters "method.request.path.somethingId=true" \
#        --authorization-type "NONE" &&
#     echo "Public API PUT method created"
#} || {
#    echo "Public API PUT method NOT created"
#}
