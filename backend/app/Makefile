SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../../base.mk

install:
	pipenv install --dev

test:
	$(DOCKER_COMPOSE) run backend ./scripts/run_tests.sh

build:
	$(MAKE) test
	$(AWS_VAULT) /bin/sh ./scripts/build.sh


deploy-api:
	$(MAKE) -C $(BASE_DIR)/infra/cdk deploy-api

push-image-to-public-repo:
	docker build -t schema-cms-public-backend .
	docker tag schema-cms-public-backend:latest public.ecr.aws/d0t6m5r1/schema-cms-public-backend:latest
	aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/d0t6m5r1
	docker push public.ecr.aws/d0t6m5r1/schema-cms-public-backend:latest

black:
	$(DOCKER_COMPOSE) run --rm -T backend black --config=pyproject.toml .