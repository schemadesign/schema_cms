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
from image_scrapping import image_scrapping  # noqa

logger = logging.getLogger()
logger.setLevel(logging.INFO)

df = None
current_job = None
current_step = None


def map_dataframe_dtypes(dtype):
    if dtype == "object":
        return "string"
    else:
        return dtype


def read_file_to_data_frame(file):
    return dt.fread(file, na_strings=["", ''], fill=True).to_pandas()


def get_preview_data(data_frame):
    items, fields = data_frame.shape

    if items == 0:
        return json.dumps({"data": [], "fields": {}}, indent=4).encode(), items, fields

    items, fields = data_frame.shape
    table_preview = json.loads(data_frame.head(5).to_json(orient="records"))
    fields_info = json.loads(data_frame.describe(include="all", percentiles=[]).to_json(orient="columns"))
    samples = json.loads(data_frame.sample(n=1).to_json(orient="records"))

    for key, value in dict(data_frame.dtypes).items():
        fields_info[key]["dtype"] = map_dataframe_dtypes(value.name)

    for key, value in samples[0].items():
        fields_info[key]["sample"] = value

    preview_data = {"data": table_preview, "fields": fields_info}

    return preview_data, items, fields


def process_datasource_meta_source_file(data: dict):
    try:
        datasource = types.DataSource.from_json(data)
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    s3obj = services.get_s3_object(datasource.file)
    data_frame = read_file_to_data_frame(s3obj["Body"])
    try:
        preview_data, items, fields = get_preview_data(data_frame)
        api.schemacms_api.update_datasource_meta(
            datasource_pk=datasource.id, items=items, fields=fields, preview_data=preview_data
        )
    except Exception as e:
        return logging.error(f"Data Source {datasource.id} fail to create meta data - {e}")


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


def process_job(job_data: dict):
    global df
    global current_job
    global current_step

    try:
        current_job = types.Job.from_json(job_data)
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    try:
        api.schemacms_api.update_job_state(job_pk=current_job.id, state=db.JobState.PROCESSING)

        logger.info(f"Loading source file: {current_job.source_file_path} ver. {current_job.source_file_version}")
        source_file = current_job.source_file

        try:
            df = read_file_to_data_frame(source_file["Body"])
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

        # Update job's meta data
        preview_data, items, fields = get_preview_data(df)
        api.schemacms_api.update_job_meta(
            job_pk=current_job.id, items=items, fields=fields, preview_data=preview_data
        )

        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=db.JobState.SUCCESS, result=result_file_name, error=""
        )
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
        handler(body["data"])

    return {"message": "Your function executed successfully!"}


if __name__ == "__main__":
    main(mocks.get_simple_mock_event(), {})
