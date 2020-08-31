SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

install:
	npm install aws-cdk@1.45.0
	pipenv install


bootstrap:
	chmod +x ./cdk-bootstrap.sh
	pipenv run $(AWS_VAULT) ./cdk-bootstrap.sh


create-ssm-params:
	pipenv run $(AWS_VAULT) python create_parameters.py

deploy-base-infra:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -e schema-cms-base;

deploy-pipeline-infra:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -c installation_mode=full -e schema-cms-cicd;

deploy-components:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -e schema-cms-components;

deploy-api:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -e schema-cms-api;

deploy-image-resize:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -c is_app_only=true -e schema-cms-image-resize;

deploy-workers:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -c is_app_only=true -e schema-cms-workers;

deploy-repo-pr-checks:
	pipenv run $(AWS_VAULT) node_modules/.bin/cdk deploy -c installation_mode=full -e schema-cms-pr-checks;
