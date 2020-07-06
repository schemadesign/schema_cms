SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

install:
	pipenv install -e .

deploy-code-commit-infra:
	$(AWS_VAULT) cdk deploy *code-commit;

deploy-base-resources-infra:
	$(AWS_VAULT) cdk deploy *base;


deploy-ci-infra:
	$(AWS_VAULT) cdk deploy *ci;
