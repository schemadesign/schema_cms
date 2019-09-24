#!/bin/bash

# sysinfo_page - A script to run all tests

SCHEMA_UI_PATH="./frontend/schemaUI"
SCHEMA_CMS_PATH="./frontend/schemaCMS"

CI=true yarn --cwd $SCHEMA_UI_PATH test
CI=true yarn --cwd $SCHEMA_UI_PATH build
CI=true yarn --cwd $SCHEMA_CMS_PATH test
