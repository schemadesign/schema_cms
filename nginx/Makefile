SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

build:
	$(AWS_VAULT) /bin/sh build.sh
