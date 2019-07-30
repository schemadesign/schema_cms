#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

function db_ready() {
    $(pipenv --py) << END
import sys
import psycopg2
try:
    conn = psycopg2.connect("dbname='$POSTGRES_DB' user='$POSTGRES_USER' host='$POSTGRES_HOST' password='$POSTGRES_PASSWORD'")
except:
    sys.exit(-1)
sys.exit(0)
END
}

db_attempts=0
until db_ready; do
    >&2 echo "Database is unavailable - sleeping"
    sleep 1
    if [ "$db_attempts" -gt 30 ]
    then
        exit 1
    else
        db_attempts=$(($db_attempts+1))
    fi
done
>&2 echo "Database is up - continuing..."

export DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
exec "$@"
