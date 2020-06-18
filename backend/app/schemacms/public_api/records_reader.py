import math
import json

from django.conf import settings

from pyarrow import BufferReader
import pyarrow.parquet as pq

from ..utils.services import get_s3


ALLOWED_OPERATORS = ["equals", "range", "in"]


def get_s3_object(path, version=None):
    params = dict(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=path)
    if version:
        params["VersionId"] = version
    return get_s3().get_object(**params)


def split_string_to_list(column_names_string):
    if column_names_string:
        names_list = list(column_names_string.split(","))
        return names_list
    return None


def get_data_format(orient):
    if orient not in ["split", "records", "index", "columns", "values", "table"]:
        return "index"
    return orient


def set_filters(query_params: dict, fields: list):
    filters_dict = {}

    for field, value in query_params.items():
        if field in fields:
            query = value.split(",")

            if query[0] not in ALLOWED_OPERATORS:
                continue

            filters_dict[field] = {"operator": query[0], "value": query[1:]}

    return filters_dict


def generate_query_for_equals(key, value):
    params = f"`{key}` == '{value['value'][0]}'"

    return params


def generate_query_for_range(key, value):
    params1 = f"`{key}` >= {value['value'][0]}"
    params2 = f"`{key}` <= {value['value'][1]}"

    return f"{params1} and {params2}"


def generate_query_for_list(key, value):
    params = f"`{key}` in {value['value']}"

    return params


QUERY_GENERATOR = {
    "equals": lambda: generate_query_for_equals,
    "range": lambda: generate_query_for_range,
    "in": lambda: generate_query_for_list,
}


def create_query_string(filters_dict: dict):
    filters = []

    for k, value in filters_dict.items():
        filters.append(QUERY_GENERATOR[value["operator"]]()(k, value))

    return " and ".join(filters)


def read_parquet_file(data_source, columns=None):
    file_name = data_source.active_job.result.name.replace(".csv", ".parquet")
    result_file = get_s3_object(file_name)

    file = pq.read_table(BufferReader(result_file["Body"].read()), columns=columns)

    return file


def read_records_preview(data_source, columns=None, orient="index", slice_=True):
    file = read_parquet_file(data_source, columns)
    if slice_:
        return json.loads(file.slice(0, 10).to_pandas().to_json(orient=orient, date_format="iso"))
    else:
        return json.loads(file.to_pandas().to_json(orient=orient, date_format="iso"))


def get_paginated_list(file, items, page, page_size, orient, query):
    if query:
        obj = dict(count=items, pages=1)
        obj["results"] = json.loads(
            file.to_pandas(strings_to_categorical=True).query(query).to_json(orient=orient, date_format="iso")
        )

        return obj

    rows_to_skip = (page - 1) * page_size
    pages = math.ceil(items / page_size)

    obj = dict(count=items, pages=pages)

    if (rows_to_skip + 1) > items:
        obj["results"] = []
    else:
        obj["results"] = json.loads(
            file.slice(rows_to_skip, page_size)
            .to_pandas(strings_to_categorical=True)
            .to_json(orient=orient, date_format="iso")
        )

    return obj
