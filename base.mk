PWD ?= pwd_unknown
BASE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))

export PROJECT_ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
CONFIG_FILE ?= $(BASE_DIR)/.project_config.json

define GetFromCfg
$(shell node -p "require('$(CONFIG_FILE)').$(1)")
endef

export ENV_STAGE ?= $(call GetFromCfg,env_stage)
export PROJECT_NAME ?= $(call GetFromCfg,project_name)

export AWS_DEFAULT_REGION ?= $(call GetFromCfg,aws.region)

export CERTIFICATE_ARN := $(call GetFromCfg,env_config.$(ENV_STAGE).certificate)

export ADMIN_PANEL_DOMAIN := $(call GetFromCfg,env_config.$(ENV_STAGE).domains.admin_panel)
export API_DOMAIN := $(call GetFromCfg,env_config.$(ENV_STAGE).domains.api)

ifeq ($(CI),true)
	AWS_VAULT =
	VERSION := $(shell cat $(BASE_DIR)/VERSION)
	DOCKER_COMPOSE = docker-compose -p $(PROJECT_NAME) -f $(BASE_DIR)/docker-compose.yml -f $(BASE_DIR)/docker-compose.ci.yml
else ifeq ($(ENV_STAGE),local)
	AWS_VAULT =
	VERSION := $(shell git describe --tags --first-parent --abbrev=11 --long --dirty --always)
	DOCKER_COMPOSE = docker-compose -p $(PROJECT_NAME)
else
	AWS_VAULT_PROFILE := $(call GetFromCfg,aws.profile)
	AWS_VAULT = aws-vault exec $(AWS_VAULT_PROFILE) --
	VERSION := $(shell git describe --tags --first-parent --abbrev=11 --long --dirty --always)
	DOCKER_COMPOSE = docker-compose -p $(PROJECT_NAME)
endif

export VERSION

CMD_ARGUMENTS ?= $(cmd)


version:
	@echo $(VERSION)

install-infra-cdk:
	npm install -g aws-cdk@1.45.0
	$(MAKE) -C $(BASE_DIR)/infra install

install-infra-functions:
	$(MAKE) -C $(BASE_DIR)/infra/functions install

install-scripts:
	$(MAKE) -C $(BASE_DIR)/scripts install

aws-shell:
	$(AWS_VAULT) $(SHELL)

up:
	$(DOCKER_COMPOSE) up --build --force-recreate

down:
	# run as a (background) service
	docker-compose -p $(PROJECT_NAME) down

clean:
	# remove created images
	@docker-compose -p $(PROJECT_NAME)_$(HOST_UID) down --remove-orphans --rmi all 2>/dev/null \
	&& echo 'Image(s) for "$(PROJECT_NAME)" removed.' \
	|| echo 'Image(s) for "$(PROJECT_NAME)" already removed.'

prune:
	# clean all that is not actively used
	docker system prune -af
