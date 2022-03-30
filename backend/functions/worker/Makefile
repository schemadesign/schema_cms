SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../../../base.mk


install:
	npm install


pack:
	node_modules/.bin/sls package

push-to-public:
	aws s3 cp ./.serverless/main.zip s3://schema-cms-lamdas-code/workers/processing-latest.zip --acl public-read

