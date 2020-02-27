#!/bin/bash

set -e

. $(dirname "$0")/install_localstack_fixtures.sh

# wait untill secretsmanager become ready
wait_for_s3
echo "S3 manager is up"


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

echo "LocalStack fixtures installed"

python wait_for_postgres.py &&
               ./manage.py migrate &&
               ./manage.py initialuser
               ./manage.py loadscripts &&
               ./manage.py create_dynamo_tables &&
               ./manage.py runserver 0.0.0.0:8000
