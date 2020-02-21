#!/bin/bash

set -e

cmd="$@"

export DB_CONNECTION="{\"host\": \"db\", \"username\": \"${POSTGRES_USER}\", \"password\": \"${POSTGRES_PASSWORD}\", \"port\": ${POSTGRES_PORT}}"

exec $cmd
