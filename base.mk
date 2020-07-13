PWD ?= pwd_unknown
BASE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))

export PROJECT_ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
CONFIG_FILE ?= $(BASE_DIR)/.project_config.json

define GetFromCfg
$(shell node -p "require('$(CONFIG_FILE)').$(1)")
endef

export AWS_DEFAULT_REGION ?= $(call GetFromCfg,aws.region)

ifeq ($(CI),true)
	AWS_VAULT =
	VERSION := $(shell cat $(BASE_DIR)/VERSION)
	DOCKER_COMPOSE = docker-compose -p schema-cms -f $(BASE_DIR)/docker-compose.yml -f $(BASE_DIR)/docker-compose.ci.yml
else ifeq ($(ENV_STAGE),local)
	AWS_VAULT =
	VERSION := $(shell git describe --tags --first-parent --abbrev=11 --long --dirty --always)
	DOCKER_COMPOSE = docker-compose -p schema-cms
else
	AWS_VAULT_PROFILE := $(call GetFromCfg,aws.profile)
	AWS_VAULT = aws-vault exec $(AWS_VAULT_PROFILE) --
	VERSION := $(shell git describe --tags --first-parent --abbrev=11 --long --dirty --always)
	DOCKER_COMPOSE = docker-compose -p schema-cms
endif

export VERSION

CMD_ARGUMENTS ?= $(cmd)


version:
	@echo $(VERSION)

install-infra-cdk:
	$(MAKE) -C $(BASE_DIR)/infra install

aws-shell:
	$(AWS_VAULT) $(SHELL)

up:
	$(DOCKER_COMPOSE) up --build --force-recreate

fe-up:
	$(MAKE) -C $(BASE_DIR)/frontend start

down:
	$(DOCKER_COMPOSE) down

exec:
	$(DOCKER_COMPOSE) exec backend bash

attach:
	docker attach schema-cms-backend

clean:
	# remove created images
	@docker-compose -p schema-cms down --remove-orphans --rmi all 2>/dev/null \
	&& echo 'Image(s) for schema-cms removed.' \
	|| echo 'Image(s) for schema-cms already removed.'

prune:
	# clean all that is not actively used
	docker system prune -af
