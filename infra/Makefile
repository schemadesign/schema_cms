SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

install:
	pipenv install

deploy-base-infra:
	pipenv run $(AWS_VAULT) cdk deploy -e *base;

deploy-components-infra:
	pipenv run $(AWS_VAULT) cdk deploy -e *components;

deploy-pipeline-infra:
	pipenv run $(AWS_VAULT) cdk deploy -e *cicd;

deploy-api:
	pipenv run $(AWS_VAULT) cdk deploy -e *api;

deploy-image-resize:
	pipenv run $(AWS_VAULT) cdk deploy -e *resize;

deploy-workers:
	pipenv run $(AWS_VAULT) cdk deploy -e *workers;

