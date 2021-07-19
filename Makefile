SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/base.mk

.PHONY: shell help build rebuild service login test clean prune version

install: install-infra-cdk
	$(MAKE) -C $(SELF_DIR)/backend/functions/worker install
	$(MAKE) -C $(SELF_DIR)/backend/functions/image_resize install
	$(MAKE) -C $(SELF_DIR)/frontend install

setup-docker:
	docker volume create --name=schema-cms-backend-db-data
	docker volume create --name=schema-cms-localstack-data

reset-docker:
	docker volume rm schema-cms-backend-db-data
	docker volume rm schema-cms-localstack-data

setup: install setup-docker

build:
	@echo Build version: $(VERSION)
	$(MAKE) -C backend/app build
	$(MAKE) -C nginx build
	$(MAKE) -C backend/functions/worker pack
	$(MAKE) -C backend/functions/image_resize pack

deploy-infra:
	$(MAKE) -C $(SELF_DIR)infra bootstrap
	$(MAKE) -C $(SELF_DIR)infra deploy-base-infra
	$(MAKE) -C $(SELF_DIR)infra deploy-pipeline-infra

deploy-components:
	$(MAKE) -C $(SELF_DIR)infra deploy-components

deploy-app:
	$(MAKE) -C $(SELF_DIR)infra create-ssm-params
	$(MAKE) -C $(SELF_DIR)infra deploy-api
	$(MAKE) -C $(SELF_DIR)infra deploy-image-resize
	$(MAKE) -C $(SELF_DIR)infra deploy-workers
	$(MAKE) -C $(SELF_DIR)infra deploy-schedulers

