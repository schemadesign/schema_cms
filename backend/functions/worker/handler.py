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

from pyarrow import BufferReader, csv as pa_csv, Table

from common import api, services, settings, types, utils
import errors
import mocks
from image_scraping import image_scraping, is_valid_url, www_to_https  # noqa


logger = logging.getLogger()
logger.setLevel(logging.INFO)

convert_options = pa_csv.ConvertOptions(strings_can_be_null=True)

if settings.SENTRY_DNS:
    sentry_sdk.init(settings.SENTRY_DNS, integrations=[AwsLambdaIntegration()])

df = None
current_job = None
current_step = None


def map_general_dtypes(dtype):
    if dtype.startswith("float") or dtype.startswith("int"):
        return utils.FieldType.NUMBER
    elif dtype.startswith("str") or dtype.startswith("object") or dtype.startswith("category"):
        return utils.FieldType.STRING
    elif dtype.startswith("bool"):
        return utils.FieldType.BOOLEAN
    elif dtype.startswith("date") or dtype.startswith("time"):
        return utils.FieldType.DATE_TIME
    else:
        raise ValueError("Unknown data type")


def read_file_to_data_frame(file):
    buffer = BytesIO()
    buffer.write(dt.fread(file, na_strings=[""], fill=True).to_csv().encode("utf-8"))

    table = pa_csv.read_csv(BufferReader(buffer.getvalue()), convert_options=convert_options).to_pandas(
        strings_to_categorical=True
    )

    return table


def get_preview_data(data_frame):
    items, fields = data_frame.shape

    if items == 0:
        return json.dumps({"data": [], "fields": {}}).encode(), items, fields

    sample_of_5 = data_frame.head(5)
    table_preview = json.loads(sample_of_5.to_json(orient="records"))
    samples = json.loads(sample_of_5.head(1).to_json(orient="records"))

    mean = data_frame.mean(numeric_only=True).to_json()
    min_ = data_frame.min(numeric_only=True).to_json()
    max_ = data_frame.max(numeric_only=True).to_json()
    std = data_frame.std(numeric_only=True).to_json()
    unique = data_frame.nunique().to_json()
    nan = data_frame.isna().sum()

    try:
        percentile_10th = data_frame.quantile(0.1, numeric_only=True).to_json()
        percentile_25th = data_frame.quantile(0.25, numeric_only=True).to_json()
        median = data_frame.quantile(0.5, numeric_only=True).to_json()
        percentile_75th = data_frame.quantile(0.75, numeric_only=True).to_json()
        percentile_90th = data_frame.quantile(0.9, numeric_only=True).to_json()
    except ValueError:
        percentile_10th = json.dumps({})
        percentile_25th = json.dumps({})
        median = json.dumps({})
        percentile_75th = json.dumps({})
        percentile_90th = json.dumps({})

    columns = data_frame.columns.to_list()

    fields_info = {}

    for i in columns:
        fields_info[i] = {}
        fields_info[i]["mean"] = json.loads(mean).get(i, None)
        fields_info[i]["median"] = json.loads(median).get(i, None)
        fields_info[i]["min"] = json.loads(min_).get(i, None)
        fields_info[i]["max"] = json.loads(max_).get(i, None)
        fields_info[i]["std"] = json.loads(std).get(i, None)
        fields_info[i]["unique"] = json.loads(unique).get(i, None)
        fields_info[i]["unique_values"] = get_unique_values_for_column(data_frame, i)
        fields_info[i]["number_of_nans"] = nan.get(i, None)
        fields_info[i]["percentile_10th"] = json.loads(percentile_10th).get(i, None)
        fields_info[i]["percentile_25th"] = json.loads(percentile_25th).get(i, None)
        fields_info[i]["percentile_75th"] = json.loads(percentile_75th).get(i, None)
        fields_info[i]["percentile_90th"] = json.loads(percentile_90th).get(i, None)
        fields_info[i]["count"] = items

    dtypes = {i: k for i, k in zip(columns, data_frame.dtypes)}
    for key, value in dtypes.items():
        fields_info[key]["dtype"] = map_general_dtypes(value.name)

    for key, value in samples[0].items():
        fields_info[key]["sample"] = value

    random_sample = json.loads(data_frame.sample(n=1).to_json(orient="records"))

    fields_with_urls = [k for k, v in random_sample[0].items() if is_valid_url(www_to_https(v))]

    preview_json = json.dumps({"data": table_preview, "fields": fields_info}, cls=utils.NumpyEncoder)

    del data_frame, sample_of_5

    return preview_json, items, fields, columns, fields_with_urls


def get_unique_values_for_column(data_frame, column):
    return json.loads(data_frame[column].unique().to_json())


def process_datasource_meta_source_file(data_source: dict):
    try:
        datasource = types.DataSource.from_json(data_source["data"])
        api.schemacms_api.update_datasource_meta(
            datasource_pk=datasource.id, status=utils.ProcessState.PROCESSING,
        )
    except Exception as e:
        return logging.critical(f"Invalid message body - {e}")

    try:
        s3obj = services.get_s3_object(datasource.file)
        data_frame = read_file_to_data_frame(s3obj["Body"])

        preview_data, items, fields, fields_names, fields_with_urls = get_preview_data(data_frame)
        api.schemacms_api.update_datasource_meta(
            datasource_pk=datasource.id,
            items=items,
            fields=fields,
            fields_names=fields_names,
            preview=json.loads(preview_data),
            fields_with_urls=fields_with_urls,
            copy_steps=data_source["copy_steps"],
            status=utils.ProcessState.SUCCESS,
        )
        logger.info(f"Meta created - DataSource # {datasource.id}")
    except Exception as e:
        api.schemacms_api.update_datasource_meta(
            datasource_pk=datasource.id,
            status=utils.ProcessState.FAILED,
            error=f"{e} @ update data source meta",
        )
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
        api.schemacms_api.update_job_state(job_pk=current_job.id, state=utils.ProcessState.PROCESSING)

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
            logger.info(f"Results saved - Job # {current_job.id}")
        except Exception as e:
            raise errors.JobSavingFilesError(f"{e} @ saving results files")

        # Update job's meta data
        preview_data, items, fields, fields_names, fields_with_urls = get_preview_data(df)
        api.schemacms_api.update_job_meta(
            job_pk=current_job.id,
            items=items,
            fields=fields,
            fields_names=fields_names,
            preview=preview_data,
            fields_with_urls=fields_with_urls,
        )

        logger.info(f"Meta created - Job # {current_job.id}")

        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=utils.ProcessState.SUCCESS, result=result_file_name, error="",
        )
    except errors.JobLoadingSourceFileError as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=utils.ProcessState.FAILED, error=f"{e} @ loading source file",
        )
        logging.error(e, exc_info=True)
        return logging.critical(f"Error while loading source file - {e}")

    except errors.JobSetExecutionError as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=utils.ProcessState.FAILED, error=f"{e.msg} @ {e.step.id}",
        )
        logging.error(e, exc_info=True)
        return logging.critical(f"Error while executing {e.step.script.name}")

    except errors.JobSavingFilesError as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=utils.ProcessState.FAILED, error=f"{e} @ saving results files",
        )
        logging.error(e, exc_info=True)
        return logging.critical(f"Error while saving results - {e}")

    except Exception as e:
        api.schemacms_api.update_job_state(
            job_pk=current_job.id, state=utils.ProcessState.FAILED, error=f"{e} @ undefined error",
        )
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
