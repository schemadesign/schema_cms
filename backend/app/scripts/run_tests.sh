#!/usr/bin/env bash

set -e

. $(dirname "$0")/install_localstack_fixtures.sh

# wait untill secretsmanager become ready
wait_for_secretsmanager
echo "Secrets manager is up"

echo "Run migrations"
/app/manage.py makemigrations --dry-run --check || { echo "ERROR: there were changes in the models, but migration listed above have not been created and are not saved in version control"; exit 1; }

echo "Run flake8"
flake8

echo "Run black"
black --config=pyproject.toml --check --quiet . || { echo "ERROR: code is unformatted"; exit 1; }

echo "Run pytest"
pytest --maxfail=1  --junitxml=/test-results/report.xml
