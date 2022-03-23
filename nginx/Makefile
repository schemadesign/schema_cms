SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

build:
	$(AWS_VAULT) /bin/sh build.sh

push-image-to-public-repo:
	docker build -t schema-cms-public-frontend .
	docker tag schema-cms-public-frontend:latest public.ecr.aws/d0t6m5r1/schema-cms-public-frontend:latest
	aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/d0t6m5r1
	docker push public.ecr.aws/d0t6m5r1/schema-cms-public-frontend:latest
