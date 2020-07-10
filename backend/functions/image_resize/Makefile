SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../../../base.mk


install:
	npm install


pack:
	node_modules/.bin/sls package
