import json
import logging
import os
import re
import sys
from io import StringIO

import dateutil
import datatable as dt
import numpy as np
import pandas as pd
import pytz
import requests
import scipy as sp

from common import (
    api,
    db,
    services,
    settings,
    types,
)
import errors
import mocks

logger = logging.getLogger()
logger.setLevel(logging.INFO)


df = None
db.initialize()


def write_dataframe_to_csv_on_s3(dataframe, filename):
    csv_buffer = StringIO()

    dataframe.to_csv(csv_buffer, encoding="utf-8", index=False)

    return services.s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, filename).put(
        Body=csv_buffer.getvalue()
    )


def process_job(job):
    global df

    api.schemacms_api.update_job_state(
        job_pk=job.id,
        state=db.JobState.PROCESSING,
    )

    source_file = services.s3.get_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=job.datasource.file.lstrip("/")
    )

    try:
        df = dt.fread(source_file["Body"], na_strings=["", ""], fill=True).to_pandas()
    except Exception as e:
        raise errors.JobLoadingSourceFileError(f"{e} @ loading source file")

    for step in job.steps:
        try:
            logging.info(f"Script **{step.script.name}** is running.")
            exec(step.body, globals())
        except Exception as e:
            raise errors.JobSetExecutionError(msg=f"{e} @ {step.id}", step=step)

        logger.info(f"Step {step.id} done")

    result_file_name = job.result_file_name
    write_dataframe_to_csv_on_s3(df, result_file_name.lstrip("/"))
    api.schemacms_api.update_job_state(
        job_pk=job.id,
        state=db.JobState.SUCCESS,
        result=result_file_name,
        error="",
    )


def main(event, context):
    """Invoke with
    python mocks.py <JobID> | sls invoke local --function main --docker --docker-arg="--network host"
    """

    logger.info(f"Incoming event: {event}")

    for record in event["Records"]:
        body = json.loads(record["body"])
        job_pk = body["job_pk"]
        try:
            job = types.Job.get_by_id(job_pk)
        except Exception as e:
            return logging.critical(f"Unable to get job from db - {e}")

        try:
            process_job(job=job)
        except errors.JobLoadingSourceFileError as e:
            api.schemacms_api.update_job_state(
                job_pk=job_pk,
                state=db.JobState.FAILED,
                error=f"{e} @ loading source file"
            )
            return logging.critical(f"Error while loading source file - {e}")
        except errors.JobSetExecutionError as e:
            api.schemacms_api.update_job_state(
                job_pk=job_pk,
                state=db.JobState.FAILED,
                error=f"{e.msg} @ {e.step.id}"
            )
            return logging.critical(f"Error while executing {e.step.script.name}")
        except Exception as e:
            return logging.critical(str(e))

    return {"message": "Your function executed successfully!"}


if __name__ == "__main__":
    main(mocks.get_simple_mock_event(sys.argv[1]), {})
