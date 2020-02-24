#!/bin/bash

set -e

. $(dirname "$0")/install_localstack_fixtures.sh

# wait untill secretsmanager become ready
wait_for_s3
echo "S3 manager is up"
wait_for_sqs
echo "SQS manager is up"


# install all localstack fixtures

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

{
    create_worker_lambda &&
    echo "Worker-Lambda function created"
} || {
    echo "Worker-Lambda function NOT created"
}

python /app/scripts/create_local_lambda.py

echo "LocalStack fixtures installed"

python wait_for_postgres.py &&
               ./manage.py migrate &&
               ./manage.py initialuser
               ./manage.py loadscripts &&
               ./manage.py create_dynamo_tables &&
               ./manage.py runserver 0.0.0.0:8000
