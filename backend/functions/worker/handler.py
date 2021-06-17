try:
    import unzip_requirements
except Exception:
    pass

import csv
import json
import logging
import os
import re
import sys
import dateutil
import datatable as dt
import numpy as np
import pandas as pd
import pytz
import requests
import scipy as sp
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration


from common import api, services, settings, types, utils
import errors
import mocks
from image_scraping import image_scraping, is_valid_url, www_to_https  # noqa

from common.processors import FileSourceProcessor, GoogleSheetProcessor, JobProcessor, processors

logger = logging.getLogger()
logger.setLevel(logging.INFO)


if settings.SENTRY_DNS:
    sentry_sdk.init(settings.SENTRY_DNS, integrations=[AwsLambdaIntegration()])

df = None
current_job = None
current_step = None


def process_datasource_meta_source_file(event: dict):
    try:
        datasource = types.DataSource.from_json(event["data"])
        api.schemacms_api.update_datasource_meta(
            datasource_pk=datasource.id, status=utils.ProcessState.PROCESSING,
        )
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    try:
        processor = processors.get(datasource.type)(
            datasource=datasource, copy_steps=event["copy_steps"], auto_refresh=event["auto_refresh"]
        )
        processor.update()

    except Exception as e:
        processor.process_fail(e)


def process_job(job_data: dict):
    global df
    global current_job
    global current_step

    try:
        current_job = types.Job.from_json(job_data["data"])
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    try:
        api.schemacms_api.update_job_state(job_pk=current_job.id, state=utils.ProcessState.PROCESSING)
        processor = JobProcessor(job=current_job)

        try:
            df = processor.read(script_process=True)
        except Exception as e:
            raise errors.JobLoadingSourceFileError(f"{e} @ loading source file")

        for step in processor.job.steps:
            current_step = step
            try:
                logging.info(f"Script **{step.script.name}** is running.")
                exec(step.body, globals())
            except Exception as e:
                raise errors.JobSetExecutionError(msg=f"{e} @ {step.id}", step=step)

            logger.info(f"Step {step.id} done")

        try:
            processor.save_result(df)
        except Exception as e:
            raise errors.JobSavingFilesError(f"{e} @ saving results files")

        processor.update_meta(df)
        processor.update_state(state=utils.ProcessState.SUCCESS)

    except errors.JobLoadingSourceFileError as e:
        processor.update_state(state=utils.ProcessState.FAILED, error=f"{e} @ loading source file")

        logging.error(e, exc_info=True)

        return logging.critical(f"Error while loading source file - {e}")

    except errors.JobSetExecutionError as e:
        processor.update_state(state=utils.ProcessState.FAILED, error=f"{e.msg} @ {e.step.id}")

        logging.error(e, exc_info=True)

        return logging.critical(f"Error while executing {e.step.script.name}")

    except errors.JobSavingFilesError as e:
        processor.update_state(state=utils.ProcessState.FAILED, error=f"{e} @ saving results files")

        logging.error(e, exc_info=True)

        return logging.critical(f"Error while saving results - {e}")

    except Exception as e:
        processor.update_state(state=utils.ProcessState.FAILED, error=f"{e} @ undefined error")

        return logging.critical(str(e), exc_info=True)


def main(event, context):
    """Invoke with
    python mocks.py sqs_message_mock.json.example | sls invoke local --function main --docker --docker-arg="--network host"
    """
    global current_job
    global current_step

    logger.info(f"Incoming event: {event}")

    for record in event["Records"]:
        body = json.loads(record["body"])
        processing_handler_mapping = {
            "datasource-meta-processing": process_datasource_meta_source_file,
            "scripts-processing": process_job,
        }
        handler = processing_handler_mapping[body["type"]]
        handler(body)

    return {"message": "Your function executed successfully!"}


if __name__ == "__main__":
    main(mocks.get_simple_mock_event(), {})
