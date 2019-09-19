#!/bin/bash

# sysinfo_page - A script to run all tests

SCHEMA_UI_PATH="./frontend/schemaUI"
SCHEMA_CMS_PATH="./frontend/schemaCMS"

yarn --cwd $SCHEMA_UI_PATH test --no-watch
yarn --cwd $SCHEMA_UI_PATH build
yarn --cwd $SCHEMA_CMS_PATH test --no-watch
docker-compose exec backend pytest

