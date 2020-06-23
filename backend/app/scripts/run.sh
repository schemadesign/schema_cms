#!/bin/bash

set -e

./manage.py migrate
./manage.py initialuser
./manage.py loadscripts

echo Starting app server...

gunicorn -c gunicorn.py schemacms.wsgi:application
