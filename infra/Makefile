SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

install:
	pipenv install -e .


deploy-base-infra:
	$(AWS_VAULT) cdk deploy -e *base;

deploy-components-infra:
	$(AWS_VAULT) cdk deploy -e *components;

deploy-pipeline-infra:
	$(AWS_VAULT) cdk deploy -e *pipeline;

deploy-api:
	$(AWS_VAULT) cdk deploy -e *api;

deploy-image-resize:
	$(AWS_VAULT) cdk deploy -e *resize;

deploy-workers:
	$(AWS_VAULT) cdk deploy -e *workers;

