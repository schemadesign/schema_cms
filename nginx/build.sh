#!/bin/bash

set -e

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')
NGINX_REPO_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/schema-cms-nginx

TASK_IMAGE_URI_NGINX=$NGINX_REPO_URI:$VERSION

docker build -t schema_cms_frontend ../frontend/
docker build -t schema_cms_backend ../backend/app/
docker build -t "$TASK_IMAGE_URI_NGINX" .
docker tag "$TASK_IMAGE_URI_NGINX" "$NGINX_REPO_URI:latest"


if DOCKER_LOGIN=$(aws ecr get-login-password --region "$AWS_DEFAULT_REGION" 2> /dev/null); then
  echo "$DOCKER_LOGIN" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID".dkr.ecr."$AWS_DEFAULT_REGION".amazonaws.com
else
  echo "get-login-password not supported by the AWS CLI, trying get-login instead..."
  # shellcheck disable=SC2091
  $(aws ecr get-login --no-include-email --region "$AWS_DEFAULT_REGION")
fi

docker push "$TASK_IMAGE_URI_NGINX"
docker push "$NGINX_REPO_URI:latest"
