#!/bin/bash

# sysinfo_page - A script to install the application

SCHEMA_UI_PATH="./frontend/schemaUI"
SCHEMA_CMS_PATH="./frontend/schemaCMS"

echo "Installing SchemaUI"
yarn --cwd $SCHEMA_UI_PATH
yarn --cwd $SCHEMA_UI_PATH build
yarn --cwd $SCHEMA_UI_PATH link

echo "Installing Schema CMS"
yarn --cwd $SCHEMA_CMS_PATH
yarn --cwd $SCHEMA_CMS_PATH link schemaUI
