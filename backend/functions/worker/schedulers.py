try:
    import unzip_requirements
except Exception:
    pass


import logging

import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from common import api, settings


logger = logging.getLogger()
logger.setLevel(logging.INFO)

if settings.SENTRY_DNS:
    sentry_sdk.init(settings.SENTRY_DNS, integrations=[AwsLambdaIntegration()])


def refresh_datasources_data(event, context):
    response = api.schemacms_api.refresh_ds_data()

    if response.status_code == 200:
        logger.info("Refresh data sources request sent.")
    else:
        logger.info("Unable to refresh data sources data")
