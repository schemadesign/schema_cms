#!/usr/bin/env bash

set -e

pip install awscli

LAMBDA_EP=http://localstack:4574
API_GTW_EP=http://localstack:4567
WORKER_QUEUE_NAME=worker-queue
PUBLIC_API_FUNCTION_NAME=public-api
WORKER_FUNCTION_NAME=worker-lambda
PUBLIC_API_GTW_NAME=rest-api
API_STAGE=test

# wait untill secretsmanager become ready

until aws --no-sign-request --endpoint-url=$SECRET_MANAGER_ENDPOINT_URL secretsmanager list-secrets; do
  >&2 echo "Secretsmanager is unavailable - sleeping"
  sleep 1
done

echo "Secrets manager is up"

# install all localstack fixtures
{
    aws --endpoint-url=$SECRET_MANAGER_ENDPOINT_URL secretsmanager create-secret \
        --name $DB_SECRET_ARN \
        --secret-string file://./scripts/dev/db-secret.json &&
    echo "DB secrets set"
} || {
    echo "DB secrets NOT set"
}
{
    aws --endpoint-url=$SQS_ENDPOINT_URL sqs create-queue --queue-name $WORKER_QUEUE_NAME &&
    echo "SQS QUEUE created"
} || {
    echo "SQS QUEUE NOT created"
}

WORKER_QUEUE_ARN=$(aws \
    --no-sign-request \
    --endpoint-url=$SQS_ENDPOINT_URL \
    sqs get-queue-attributes \
    --queue-url $SQS_QUEUE_URL \
    --query "Attributes.QueueArn" \
    --attribute-names QueueArn \
    --output text)

echo "Worker queue ARN: $WORKER_QUEUE_ARN"

{
    aws --no-sign-request --endpoint-url=$LAMBDA_EP lambda create-function \
        --function-name $PUBLIC_API_FUNCTION_NAME \
        --code S3Bucket="__local__",S3Key="/app/functions/public_api" \
        --handler handlers.handle \
        --runtime python3.7 \
        --role whatever &&
    echo "Public API lambda function created"
} || {
    echo "Public API lambda function NOT created"
}

LAMBDA_ARN=$(aws \
    --no-sign-request \
    --endpoint-url=$LAMBDA_EP \
    lambda list-functions \
    --query "Functions[?FunctionName==\`$PUBLIC_API_FUNCTION_NAME\`].FunctionArn" \
    --output text \
    --region $AWS_DEFAULT_REGION)

{
    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway create-rest-api \
        --region $AWS_DEFAULT_REGION \
        --name $PUBLIC_API_GTW_NAME &&
    echo "Public API rest api created"
} || {
    echo "Public API rest api NOT created"
}

API_ID=$(aws \
    --no-sign-request \
    --endpoint-url=$API_GTW_EP \
    apigateway get-rest-apis \
    --query "items[?name==\`$PUBLIC_API_GTW_NAME\`].id" \
    --output text \
    --region $AWS_DEFAULT_REGION)
PARENT_RESOURCE_ID=$(aws \
    --no-sign-request \
    --endpoint-url=$API_GTW_EP \
    apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[?path==`/`].id' \
    --output text \
    --region $AWS_DEFAULT_REGION)

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

{
    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway put-integration \
        --region $AWS_DEFAULT_REGION \
        --rest-api-id $API_ID \
        --resource-id $PARENT_RESOURCE_ID \
        --http-method GET \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri arn:aws:apigateway:$AWS_DEFAULT_REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations \
        --passthrough-behavior WHEN_NO_MATCH &&
     echo "Public API integration created"
} || {
    echo "Public API integration NOT created"
}

{
    aws --no-sign-request --endpoint-url=$API_GTW_EP apigateway create-deployment \
        --region $AWS_DEFAULT_REGION \
        --rest-api-id $API_ID \
        --stage-name $API_STAGE &&
    echo "Public API deployment created"
} || {
    echo "Public API deployment NOT created"
}


# Worker lambda installation

{
    aws --no-sign-request --endpoint-url=$LAMBDA_EP lambda create-function \
        --function-name $WORKER_FUNCTION_NAME \
        --code S3Bucket="__local__",S3Key="/app/functions/worker" \
        --handler handlers.handle_queue_event \
        --runtime python3.7 \
        --role whatever &&
    echo "Public API lambda function created"
} || {
    echo "Public API lambda function NOT created"
}

WORKER_LAMBDA_ARN=$(aws \
    --no-sign-request \
    --endpoint-url=$LAMBDA_EP \
    lambda list-functions \
    --query "Functions[?FunctionName==\`$WORKER_FUNCTION_NAME\`].FunctionArn" \
    --output text \
    --region $AWS_DEFAULT_REGION)

{
    aws \
    --no-sign-request --endpoint-url=$LAMBDA_EP \
    lambda create-event-source-mapping \
    --event-source-arn $WORKER_QUEUE_ARN \
    --function-name $WORKER_FUNCTION_NAME &&
    echo "Worker lambda event source created"
} || {
    echo "Worker lambda event source NOT created"
}

echo "LocalStack fixtures installed"

python wait_for_postgres.py &&
               ./manage.py migrate &&
               ./manage.py runserver 0.0.0.0:8000
