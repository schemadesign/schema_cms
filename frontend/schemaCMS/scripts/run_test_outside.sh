#!/bin/bash

set -Eexo pipefail

CWD="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd $CWD/../..

export APP="SchemaCMS"
export TEST_ENV="jest"
export PROJECT_NAME="$APP${CIRCLE_SHA1-}$TEST_ENV"
VOLUME_NAME="_snapshot_output"
export COMPOSE_DOCKER_CLI_BUILD=1

function cleanup() {
  docker-compose --project-name $PROJECT_NAME down
  docker network rm ${CIRCLE_SHA1-}${APP}${TEST_ENV}js || echo "no network found to remove"
}

trap cleanup EXIT


docker volume rm "$PROJECT_NAME$VOLUME_NAME" || echo "No volume to delete"
docker-compose --project-name $PROJECT_NAME -f ./docker-compose.yml build test

# Run the tests, and copy the new snapshots out
echo "Updating Snapshots"
docker-compose --project-name $PROJECT_NAME run test npm run test -- -u
CONTAINER_ID=$(docker-compose --project-name $PROJECT_NAME run -d test sleep 10000)
docker cp $CONTAINER_ID:/webapp/schemaCMS/src ./schemaCMS
docker kill $CONTAINER_ID

cleanup
