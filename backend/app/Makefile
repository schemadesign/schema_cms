SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../../base.mk

test:
	$(DOCKER_COMPOSE) run backend ./scripts/run_tests.sh

build:
	#$(MAKE) test
	$(AWS_VAULT) /bin/sh ./scripts/build.sh