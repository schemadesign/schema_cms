SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../../../base.mk


install:
	npm install


pack:
	node_modules/.bin/sls package

push-to-public:
	aws s3 cp ./.serverless/main.zip s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-eu-north-1/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-eu-west-1/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-eu-west-2/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-us-east-1/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-us-east-2/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-us-west-1/workers/resize-lambda-latest.zip
	aws s3 cp s3://schema-cms-lamdas-code-eu-central-1/workers/resize-lambda-latest.zip s3://schema-cms-lamdas-code-us-west-2/workers/resize-lambda-latest.zip
