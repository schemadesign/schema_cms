.PHONY: install

SCHEMA_UI_PATH="./frontend/schemaUI"
SCHEMA_CMS_PATH="./frontend/schemaCMS"
WORKER_LAMBDA_PATH="./backend/functions/worker"

install:
	@echo "Installing SchemaUI"
	yarn --cwd $(SCHEMA_UI_PATH)
	yarn --cwd $(SCHEMA_UI_PATH) build
	yarn --cwd $(SCHEMA_UI_PATH) link

	@echo "Installing Schema CMS"
	yarn --cwd $(SCHEMA_CMS_PATH)
	yarn --cwd $(SCHEMA_CMS_PATH) link schemaUI

	@echo "Installing Lambdas dependencies"
	cd $(PUBLIC_API_LAMBDA_PATH) && npm install
	cd ./

	@echo "Installing Schema CMS Backend"
	docker volume create --name=localstack_data
	docker volume create --name=schema_cms_db_data
	docker-compose up

clean_localstack_volume:
	@echo "Cleaning localstack data"
	docker volume rm localstack_data
	docker volume create --name=localstack_data

clean_db_volume:
	@echo "Cleaning db data"
	docker volume rm schema_cms_db_data
	docker volume create --name=schema_cms_db_data

PWD ?= pwd_unknown

export PROJECT_ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
CONFIG_FILE ?= $(PROJECT_ROOT_DIR)/.project_config.json

define GetFromCfg
$(shell node -p "require('$(CONFIG_FILE)').$(1)")
endef

export ENV_STAGE ?= $(call GetFromCfg,env_stage)
export PROJECT_NAME ?= $(call GetFromCfg,project_name)

export AWS_DEFAULT_REGION ?= $(call GetFromCfg,aws.region)

ifeq ($(CI),true)
	AWS_VAULT =
	VERSION := $(shell cat $(PROJECT_ROOT_DIR)/VERSION)
else
	AWS_VAULT_PROFILE := $(call GetFromCfg,aws.profile)
	AWS_VAULT = aws-vault exec $(AWS_VAULT_PROFILE) --
	VERSION := $(shell git describe --tags --first-parent --abbrev=11 --long --dirty --always)
endif
export VERSION



install-infra:



