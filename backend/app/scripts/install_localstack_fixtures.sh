#!/bin/bash

set -e

S3_ENDPOINT_URL=http://localstack:4572
SQS_ENDPOINT_URL=http://localstack:4576


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

function create_worker_lambda() {
  cd ../functions/worker && \
  SLS_DEBUG=* node_modules/serverless/bin/serverless package --verbose --stage local && \
  cd ../../app
}

function create_image_handler_lambda() {
  cd ../functions/image-handler && \
  SLS_DEBUG=* serverless deploy --verbose --stage local && \
  cd ../../app
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
