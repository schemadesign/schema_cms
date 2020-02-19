#!/usr/bin/env bash

set -e

python /app/wait_for_postgres.py

echo "Run migrations"
/app/manage.py makemigrations --dry-run --check || { echo "ERROR: there were changes in the models, but migration listed above have not been created and are not saved in version control"; exit 1; }

echo "Run flake8"
flake8

echo "Run black"
black --config=pyproject.toml --check --quiet . || { echo "ERROR: code is unformatted"; exit 1; }

echo "Run pytest"
pytest --maxfail=1  --junitxml=/test-results/report.xml
