import json
import logging
import sys

import db
import mocks

logger = logging.getLogger()
logger.setLevel(logging.INFO)


df = None
db.initialize()


def main(event, context):
    """Invoke with
    python mocks.py <JobID> | sls invoke local --function main --docker --docker-arg="--network host"
    """
    logger.debug(json.dumps(event))
    return {
        "statusCode": 200,
        "headers": {},
        "body": json.dumps({"message": "Public api here. Version 7"}),
    }


if __name__ == "__main__":
    main(mocks.get_simple_mock_event(sys.argv[1]), {})
