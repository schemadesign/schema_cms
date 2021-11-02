#!/bin/bash

set -Eexo pipefail

CWD="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd $CWD/../..

export APP="schema-cms-"
export TEST_ENV="jest"
export PROJECT_NAME="$APP${CIRCLE_SHA1-}$TEST_ENV"
VOLUME_NAME="_snapshot_output"
export COMPOSE_DOCKER_CLI_BUILD=1

docker build --tag $PROJECT_NAME --file ./DockerfileBase .

# Run the tests, and copy the new snapshots out
echo "Updating Snapshots"
# TODO investigate how we can automatically close Jest ( --watchAll=false --forceExit flags doesnt work)
docker run --volume $(pwd)/schemaCMS/src:/webapp/schemaCMS/src --rm --interactive --tty $PROJECT_NAME npm run test -- -u
