#!/bin/bash

set -e

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')
BACKEND_REPO_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/schema-cms-app

TASK_IMAGE_URI_BACKEND=$BACKEND_REPO_URI:$VERSION

docker build -t "$TASK_IMAGE_URI_BACKEND" .
docker tag "$TASK_IMAGE_URI_BACKEND" "$BACKEND_REPO_URI:latest"

# shellcheck disable=SC2091
$(aws ecr get-login --no-include-email --region "$AWS_DEFAULT_REGION")

docker push "$TASK_IMAGE_URI_BACKEND"
docker push "$BACKEND_REPO_URI:latest"
