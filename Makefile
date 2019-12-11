.PHONY: install

SCHEMA_UI_PATH="./frontend/schemaUI"
SCHEMA_CMS_PATH="./frontend/schemaCMS"

install:
	@echo "Installing SchemaUI"
	yarn --cwd $(SCHEMA_UI_PATH)
	yarn --cwd $(SCHEMA_UI_PATH) build
	yarn --cwd $(SCHEMA_UI_PATH) link

	@echo "Installing Schema CMS"
	yarn --cwd $(SCHEMA_CMS_PATH)
	yarn --cwd $(SCHEMA_CMS_PATH) link schemaUI

	@echo "Installing Schema CMS Backend"
	docker volume create --name=localstack_data
	docker volume create --name=schema_cms_db_data
	docker-compose up
