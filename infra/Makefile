SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

install:
	pipenv install

deploy-base-infra:
	pipenv run $(AWS_VAULT) cdk deploy -e schema-cms-base;

deploy-components-infra:
	pipenv run $(AWS_VAULT) cdk deploy -e schema-cms-components;

deploy-pipeline-infra:
	pipenv run $(AWS_VAULT) cdk deploy -e schema-cms-cicd;

deploy-api:
	pipenv run $(AWS_VAULT) cdk deploy -e schema-cms-api;

deploy-image-resize:
	pipenv run $(AWS_VAULT) cdk deploy -e schema-cms-image-resize;

deploy-workers:
	pipenv run $(AWS_VAULT) cdk deploy -c is_app_only=true -e schema-cms-workers;

