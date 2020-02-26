.PHONY: install

SCHEMA_UI_PATH="./frontend/schemaUI"
SCHEMA_CMS_PATH="./frontend/schemaCMS"
WORKER_LAMBDA_PATH="./backend/functions/worker"
PUBLIC_API_LAMBDA_PATH="./backend/functions/public_api"

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

install_lambdas:
	cd $(PUBLIC_API_LAMBDA_PATH) && npm install
	cd ./
