#!/usr/bin/env bash

set -e

LAMBDA_EP=http://localstack:4574
API_GTW_EP=http://localstack:4567
WORKER_QUEUE_NAME=worker-queue
PUBLIC_API_FUNCTION_NAME=public-api
WORKER_FUNCTION_NAME=worker-lambda
PUBLIC_API_GTW_NAME=rest-api
API_STAGE="test"

function wait_for_secretsmanager {
  until aws --no-sign-request --endpoint-url="$SECRET_MANAGER_ENDPOINT_URL" secretsmanager list-secrets; do
    >&2 echo "Secretsmanager is unavailable - sleeping"
    sleep 1
  done
}

function install_db_secret {
    aws --endpoint-url="$SECRET_MANAGER_ENDPOINT_URL" secretsmanager create-secret \
        --name "$DB_SECRET_ARN" \
        --secret-string file://./scripts/dev/db-secret.json
}

function create_sqs_queue {
  aws --endpoint-url="$SQS_ENDPOINT_URL" sqs create-queue --queue-name $WORKER_QUEUE_NAME
}

function get_worker_queue_arn {
    aws \
    --no-sign-request \
    --endpoint-url="$SQS_ENDPOINT_URL" \
    sqs get-queue-attributes \
    --queue-url "$SQS_QUEUE_URL" \
    --query "Attributes.QueueArn" \
    --attribute-names QueueArn \
    --output text
}

function create_public_api_lambda {
    aws --no-sign-request --endpoint-url=$LAMBDA_EP lambda create-function \
        --function-name $PUBLIC_API_FUNCTION_NAME \
        --code S3Bucket="__local__",S3Key="/app/functions/public_api" \
        --handler handlers.handle \
        --runtime python3.7 \
        --role whatever
}

function get_public_api_lambda_arn {
    aws \
    --no-sign-request \
    --endpoint-url=$LAMBDA_EP \
    lambda list-functions \
    --query "Functions[?FunctionName==\`$PUBLIC_API_FUNCTION_NAME\`].FunctionArn" \
    --output text \
    --region "$AWS_DEFAULT_REGION"
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

function create_worker_lambda {
    aws --no-sign-request --endpoint-url=$LAMBDA_EP lambda create-function \
        --function-name $WORKER_FUNCTION_NAME \
        --code S3Bucket="__local__",S3Key="/app/functions/worker" \
        --handler handlers.handle_queue_event \
        --runtime python3.7 \
        --role whatever
}

function create_worker_lambda_event_resource {
    aws \
    --no-sign-request --endpoint-url=$LAMBDA_EP \
    lambda create-event-source-mapping \
    --event-source-arn $1 \
    --function-name $WORKER_FUNCTION_NAME
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
