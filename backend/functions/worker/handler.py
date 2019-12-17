try:
    import unzip_requirements
except ImportError:
    pass

import csv
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
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

from pyarrow import BufferReader, Table

from common import api, db, services, settings, types
import errors
import mocks
from image_scraping import image_scraping  # noqa
from utils import FieldType, NumpyEncoder


logger = logging.getLogger()
logger.setLevel(logging.INFO)


if settings.SENTRY_DNS:
    sentry_sdk.init(settings.SENTRY_DNS, integrations=[AwsLambdaIntegration()])

df = None
current_job = None
current_step = None


def map_general_dtypes(dtype):
    if dtype.startswith("float") or dtype.startswith("int"):
        return FieldType.NUMBER
    elif dtype.startswith("str") or dtype.startswith("object") or dtype.startswith("category"):
        return FieldType.STRING
    elif dtype.startswith("bool"):
        return FieldType.BOOLEAN
    elif dtype.startswith("date") or dtype.startswith("time"):
        return FieldType.DATE
    else:
        raise ValueError("Unknown data type")


def read_file_to_data_frame(file):
    table = Table.from_pydict(dt.fread(file, na_strings=[""], fill=True).to_dict())

    return table.to_pandas(date_as_object=True, strings_to_categorical=True)


def get_preview_data(data_frame):
    items, fields = data_frame.shape

    if items == 0:
        return json.dumps({"data": [], "fields": {}}).encode(), items, fields

    sample_of_5 = data_frame.head(5)
    table_preview = json.loads(sample_of_5.to_json(orient="records", date_format=None))
    fields_info = json.loads(data_frame.describe(include="all").to_json(orient="columns", double_precision=2))
    samples = json.loads(sample_of_5.head(1).to_json(orient="records", date_format=None))
    columns = data_frame.columns.to_list()

    dtypes = {i: k for i, k in zip(columns, data_frame.dtypes)}
    for key, value in dtypes.items():
        fields_info[key]["dtype"] = map_general_dtypes(value.name)

    for key, value in samples[0].items():
        fields_info[key]["sample"] = value

    preview_json = json.dumps({"data": table_preview, "fields": fields_info}, cls=NumpyEncoder)

    del data_frame, sample_of_5

    return preview_json, items, fields, columns


def process_datasource_meta_source_file(data_source: dict):
    try:
        datasource = types.DataSource.from_json(data_source["data"])
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    s3obj = services.get_s3_object(datasource.file)
    data_frame = read_file_to_data_frame(s3obj["Body"])
    try:
        preview_data, items, fields, fields_names = get_preview_data(data_frame)
        api.schemacms_api.update_datasource_meta(
            datasource_pk=datasource.id,
            items=items,
            fields=fields,
            fields_names=fields_names,
            preview_data=preview_data,
            copy_steps=data_source["copy_steps"],
        )
        logger.info(f"Meta created - DataSource # {datasource.id}")
    except Exception as e:
        return logging.error(f"Data Source {datasource.id} fail to create meta data - {e}")


def write_data_frame_to_csv_on_s3(data_frame, filename):
    csv_buffer = StringIO()

    csv_buffer.write(data_frame.to_csv(index=False))
    services.s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, filename).put(Body=csv_buffer.getvalue())


def write_data_frame_to_parquet_on_s3(data_frame, file_name):
    buffer = BytesIO()

    data_frame.to_parquet(buffer, engine="pyarrow")

    services.s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, file_name.replace(".csv", ".parquet")).put(
        Body=buffer.getvalue()
    )


def process_job(job_data: dict):
    global df
    global current_job
    global current_step

    try:
        current_job = types.Job.from_json(job_data["data"])
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    try:
        api.schemacms_api.update_job_state(job_pk=current_job.id, state=db.JobState.PROCESSING)

        source_file = current_job.source_file
        source_file_path = current_job.source_file_path
        source_file_version = current_job.source_file_version

        logger.info(f"Loading source file: {source_file_path} ver. {source_file_version}")

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

        try:
            write_data_frame_to_csv_on_s3(df, result_file_name)
            write_data_frame_to_parquet_on_s3(df, result_file_name)
        except Exception as e:
            raise errors.JobSavingFilesError(f"{e} @ saving results files")

        # Update job's meta data
        preview_data, items, fields, fields_names = get_preview_data(df)
        api.schemacms_api.update_job_meta(
            job_pk=current_job.id,
            items=items,
            fields=fields,
            fields_names=fields_names,
            preview_data=preview_data,
        )

        logger.info(f"Meta created - Job # {current_job.id}")

        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=db.JobState.SUCCESS, result=result_file_name, error="",
        )
    except errors.JobLoadingSourceFileError as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=db.JobState.FAILED, error=f"{e} @ loading source file",
        )
        logging.error(e, exc_info=True)
        return logging.critical(f"Error while loading source file - {e}")

    except errors.JobSetExecutionError as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=db.JobState.FAILED, error=f"{e.msg} @ {e.step.id}",
        )
        logging.error(e, exc_info=True)
        return logging.critical(f"Error while executing {e.step.script.name}")

    except errors.JobSavingFilesError as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=db.JobState.FAILED, error=f"{e} @ saving results files",
        )
        logging.error(e, exc_info=True)
        return logging.critical(f"Error while saving results - {e}")

    except Exception as e:
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
