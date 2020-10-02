try:
    import unzip_requirements
except Exception:
    pass


import json
import logging
from urllib.parse import urlparse
from dataclasses import dataclass
from io import StringIO, BytesIO

import datatable as dt
from image_scraping import is_valid_url, www_to_https

from . import settings
from .api import schemacms_api
from .services import get_s3_object, s3_resource
from .types import DataSource, Job
from .utils import NumpyEncoder, FieldType, ProcessState

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def read_file_to_data_frame(file):
    table = dt.fread(file, na_strings=[""], fill=True).to_pandas()

    return table


def get_unique_values_for_column(data_frame, column):
    return data_frame[column].dropna().unique().tolist()


def write_data_frame_to_csv_on_s3(data_frame, filename):
    csv_buffer = StringIO()

    csv_buffer.write(data_frame.to_csv(index=False))
    s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, filename).put(
        Body=csv_buffer.getvalue(), ACL="public-read"
    )


def write_data_frame_to_parquet_on_s3(data_frame, file_name):
    buffer = BytesIO()

    data_frame.to_parquet(buffer, engine="pyarrow")

    s3_resource.Object(settings.AWS_STORAGE_BUCKET_NAME, file_name.replace(".csv", ".parquet")).put(
        Body=buffer.getvalue()
    )


def map_general_dtypes(dtype):
    if dtype.startswith("float") or dtype.startswith("int"):
        return FieldType.NUMBER
    elif dtype.startswith("str") or dtype.startswith("object") or dtype.startswith("category"):
        return FieldType.STRING
    elif dtype.startswith("bool"):
        return FieldType.BOOLEAN
    elif dtype.startswith("date") or dtype.startswith("time"):
        return FieldType.DATE_TIME
    else:
        raise ValueError("Unknown data type")


def get_preview_data(data_frame):
    items, fields = data_frame.shape

    if items == 0:
        return json.dumps({"data": [], "fields": {}}).encode(), items, fields

    sample_of_5 = data_frame.head(5)
    table_preview = json.loads(sample_of_5.to_json(orient="records", date_format="iso"))
    samples = json.loads(sample_of_5.head(1).to_json(orient="records", date_format="iso"))

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

    all_columns = data_frame.columns.to_list()
    non_numeric_columns = data_frame.select_dtypes(exclude=["number"]).columns.tolist()

    fields_info = {}

    for i in all_columns:
        fields_info[i] = {}
        fields_info[i]["mean"] = json.loads(mean).get(i, None)
        fields_info[i]["median"] = json.loads(median).get(i, None)
        fields_info[i]["min"] = json.loads(min_).get(i, None)
        fields_info[i]["max"] = json.loads(max_).get(i, None)
        fields_info[i]["std"] = json.loads(std).get(i, None)
        fields_info[i]["unique"] = json.loads(unique).get(i, None)
        fields_info[i]["unique_values"] = (
            get_unique_values_for_column(data_frame, i) if i in non_numeric_columns else None
        )
        fields_info[i]["number_of_nans"] = nan.get(i, None)
        fields_info[i]["percentile_10th"] = json.loads(percentile_10th).get(i, None)
        fields_info[i]["percentile_25th"] = json.loads(percentile_25th).get(i, None)
        fields_info[i]["percentile_75th"] = json.loads(percentile_75th).get(i, None)
        fields_info[i]["percentile_90th"] = json.loads(percentile_90th).get(i, None)
        fields_info[i]["count"] = items

    dtypes = {i: k for i, k in zip(all_columns, data_frame.dtypes)}
    for key, value in dtypes.items():
        fields_info[key]["dtype"] = map_general_dtypes(value.name)

    for key, value in samples[0].items():
        fields_info[key]["sample"] = value

    random_sample = json.loads(data_frame.sample(n=1).to_json(orient="records"))

    fields_with_urls = [k for k, v in random_sample[0].items() if is_valid_url(www_to_https(v))]

    preview_json = json.dumps({"data": table_preview, "fields": fields_info}, cls=NumpyEncoder)

    del data_frame, sample_of_5

    return {
        "preview": json.loads(preview_json),
        "items": items,
        "fields": fields,
        "fields_names": all_columns,
        "fields_with_urls": fields_with_urls,
    }


@dataclass
class SourceProcessor:
    datasource: DataSource
    copy_steps: bool = False

    def read(self, script_process=False):
        pass

    def get_preview(self) -> dict:
        preview_data_dict = get_preview_data(self.read())

        return preview_data_dict

    def update(self):
        preview_dict = self.get_preview()
        schemacms_api.update_datasource_meta(
            datasource_pk=self.datasource.id,
            copy_steps=self.copy_steps,
            status=ProcessState.SUCCESS,
            **preview_dict,
        )

        logger.info(f"Meta created - DataSource # {self.datasource.id}")

    def process_fail(self, error):
        schemacms_api.update_datasource_meta(
            datasource_pk=self.datasource.id,
            status=ProcessState.FAILED,
            error=f"{error} @ update data source meta",
        )
        logging.error(f"Data Source {self.datasource.id} fail to create meta data - {error}")

    def source_info(self):
        pass


@dataclass
class FileSourceProcessor(SourceProcessor):
    def read(self, script_process=False):
        s3obj = get_s3_object(self.datasource.file)
        data_frame = read_file_to_data_frame(s3obj["Body"])

        return data_frame

    def source_info(self):
        return {}


@dataclass
class GoogleSheetProcessor(SourceProcessor):
    def read(self, script_process=False):

        if not script_process:
            parsed_url = urlparse(self.datasource.google_sheet)

            fragment = parsed_url.fragment

            if fragment.find("gid=") != -1:
                gid = fragment.rsplit("gid=", 1)[1]
            else:
                gid = None

            url = f"https://{parsed_url.netloc}/{parsed_url.path}"

            if url.endswith("edit"):
                url = url[:-5]

            extra_params = f"export?format=csv&gid={gid}" if gid else "export?format=csv"

            sheet_url = url + "/" + extra_params
            data_frame = read_file_to_data_frame(sheet_url)
        else:
            s3obj = get_s3_object(self.datasource.file)
            data_frame = read_file_to_data_frame(s3obj["Body"])

        return data_frame

    def update(self):
        preview_dict = self.get_preview()
        preview_dict["source_file"] = self.get_source_file_name()

        schemacms_api.update_datasource_meta(
            datasource_pk=self.datasource.id,
            copy_steps=self.copy_steps,
            status=ProcessState.SUCCESS,
            **preview_dict,
        )

        logger.info(f"Meta created - DataSource # {self.datasource.id}")

    def save_source_file(self, data_frame):
        file_name = self.get_source_file_name()
        write_data_frame_to_csv_on_s3(data_frame, file_name)
        write_data_frame_to_parquet_on_s3(data_frame, file_name)
        logger.info(f"Google Sheet Source File Saved - DS # {self.datasource.id}")

    def get_source_file_name(self):
        return f"{self.datasource.id}/uploads/google_sheet_source_file.csv"

    def get_preview(self) -> dict:
        data_frame = self.read()
        self.save_source_file(data_frame)
        preview_data_dict = get_preview_data(data_frame)

        return preview_data_dict


processors = {"file": FileSourceProcessor, "google_sheet": GoogleSheetProcessor}


@dataclass
class JobProcessor:
    job: Job

    def read(self, script_process=False):
        source_processor = self.get_source_processor()

        return source_processor.read(script_process)

    @staticmethod
    def get_preview(data_frame) -> dict:
        preview_data_dict = get_preview_data(data_frame)

        return preview_data_dict

    def update_meta(self, data_frame):
        preview_dict = self.get_preview(data_frame)

        schemacms_api.update_job_meta(job_pk=self.job.id, **preview_dict)

        logger.info(f"Meta created - Job # {self.job.id}")

    def update_state(self, state, error=""):
        if state == ProcessState.SUCCESS:
            schemacms_api.update_job_state(
                job_pk=self.job.id, state=state, result=self.get_result_file_name(), error="",
            )
        else:
            schemacms_api.update_job_state(
                job_pk=self.job.id, state=state, error=error,
            )

    def save_result(self, data_frame):
        file_name = self.get_result_file_name()
        write_data_frame_to_csv_on_s3(data_frame, file_name)
        write_data_frame_to_parquet_on_s3(data_frame, file_name)
        logger.info(f"Results saved - Job # {self.job.id}")

    def get_source_processor(self):
        source_type = self.job.datasource.type

        return processors.get(source_type)(self.job.datasource)

    def get_result_file_name(self):
        return f"{self.job.datasource.id}/jobs/{self.job.id}/outputs/job_{self.job.id}_result.csv"
