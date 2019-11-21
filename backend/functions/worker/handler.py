try:
    import unzip_requirements
except ImportError:
    pass

import json
import logging
import os
import re
import sys
from io import StringIO, BytesIO

import dateutil
import datatable as dt
import numpy as np
import pandas as pd
import pytz
import requests
import scipy as sp

from common import api, db, services, settings, types
import errors
import mocks
from image_scrapping import image_scrapping

logger = logging.getLogger()
logger.setLevel(logging.INFO)

df = None
current_job = None
current_step = None


def write_dataframe_to_csv_on_s3(dataframe, filename):
    csv_buffer = StringIO()

    dataframe.to_csv(csv_buffer, encoding="utf-8", index=False)
    return services.s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, filename).put(
        Body=csv_buffer.getvalue()
    )


def write_dataframe_to_parquet_on_s3(dataframe, filename):
    buffer = BytesIO()
    dataframe.to_parquet(buffer, engine="pyarrow", index=False)

    return services.s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, filename).put(Body=buffer.getvalue())


def process_job():
    global df
    global current_job
    global current_step

    api.schemacms_api.update_job_state(job_pk=current_job.id, state=db.JobState.PROCESSING)

    logger.info(f"Loading source file: {current_job.source_file_path} ver. {current_job.source_file_version}")
    source_file = services.get_s3_object(
        current_job.source_file_path, version=current_job.source_file_version
    )
    try:
        df = dt.fread(source_file["Body"], na_strings=["", ""], fill=True).to_pandas()
    except Exception as e:
        raise errors.JobLoadingSourceFileError(f"{e} @ loading source file")

    for step in current_job.steps:
        current_step = step
        try:
            logging.info(f"Script **{step.script.name}** is running.")
            exec(step.body, globals())
        except Exception as e:
            raise errors.JobSetExecutionError(msg=f"{e} @ {step.id}", step=step)

        logger.info(f"Step {step.id} done")

    result_file_name = (
        f"{current_job.datasource.id}/jobs/{current_job.id}/outputs/job_{current_job.id}_result.csv"
    )
    write_dataframe_to_csv_on_s3(df, result_file_name)
    write_dataframe_to_parquet_on_s3(df, result_file_name.replace(".csv", ".parquet"))

    api.schemacms_api.update_job_state(
        job_pk=current_job.id, state=db.JobState.SUCCESS, result=result_file_name, error=""
    )


def main(event, context):
    """Invoke with
    python mocks.py sqs_message_mock.json.example | sls invoke local --function main --docker --docker-arg="--network host"
    """
    global current_job
    global current_step

    logger.info(f"Incoming event: {event}")

    for record in event["Records"]:
        body = json.loads(record["body"])
        try:
            current_job = types.Job.from_json(body)
        except Exception as e:
            return logging.critical(f"Invalid message body - {e}")

        try:
            process_job()
        except errors.JobLoadingSourceFileError as e:
            api.schemacms_api.update_job_state(
                job_pk=current_job.id, state=db.JobState.FAILED, error=f"{e} @ loading source file"
            )
            logging.error(e, exc_info=True)
            return logging.critical(f"Error while loading source file - {e}")
        except errors.JobSetExecutionError as e:
            api.schemacms_api.update_job_state(
                job_pk=current_job.id, state=db.JobState.FAILED, error=f"{e.msg} @ {e.step.id}"
            )
            logging.error(e, exc_info=True)
            return logging.critical(f"Error while executing {e.step.script.name}")
        except Exception as e:
            logging.error(e, exc_info=True)
            return logging.critical(str(e))

    return {"message": "Your function executed successfully!"}


if __name__ == "__main__":
    main(mocks.get_simple_mock_event(), {})
