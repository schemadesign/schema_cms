SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(SELF_DIR)/../base.mk

SCHEMA_UI_PATH="./schemaUI"
SCHEMA_CMS_PATH="./schemaCMS"

install:
	@echo "Installing SchemaUI"
	yarn --cwd $(SCHEMA_UI_PATH)
	yarn --cwd $(SCHEMA_UI_PATH) build
	yarn --cwd $(SCHEMA_UI_PATH) link

	@echo "Installing Schema CMS"
	yarn --cwd $(SCHEMA_CMS_PATH)
	yarn --cwd $(SCHEMA_CMS_PATH) link schemaUI


start:
	yarn --cwd $(SCHEMA_CMS_PATH) start
