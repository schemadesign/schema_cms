from dataclasses import asdict
import json
import logging

import math

from flask import Flask, abort, request, Response
from flask_cors import CORS

import pandas as pd
from pyarrow import BufferReader
import pyarrow.parquet as pq

from common import services, settings, types, utils

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
CORS(app)


def create_response(data):
    return Response(json.dumps(data, ensure_ascii=True), content_type="application/json; charset=utf-8",)


# Projects endpoints


@app.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    try:
        project = types.Project.get_by_id(id=project_id)
    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(asdict(project)), 200


# Pages endpoints


@app.route("/pages/<int:page_id>", methods=["GET"])
def get_page(page_id):
    try:
        page = types.Page.get_by_id(id=page_id)
    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(asdict(page)), 200


# Data Sources endpoints


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def get_data_source(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        filters = data_source.filters
        fields = data_source.fields
        result_file = services.get_s3_object(data_source.result_parquet)
        file = pq.read_table(BufferReader(result_file["Body"].read()))
        records = json.loads(file.slice(0, 10).to_pandas().to_json(orient="records"))

    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    data = {"meta": {}, "fields": fields, "filters": filters, "records": records}

    return create_response(data), 200


@app.route("/datasources/<int:data_source_id>/fields", methods=["GET"])
def get_data_source_fields(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        fields = data_source.fields
    except Exception as e:
        logging.info(f"Unable to get fields - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(fields), 200


@app.route("/datasources/<int:data_source_id>/filters", methods=["GET"])
def get_data_source_filters(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        filters = data_source.filters
    except Exception as e:
        logging.info(f"Unable to get filters - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(filters), 200


@app.route("/datasources/<int:data_source_id>/records", methods=["GET"])
def get_data_source_records(data_source_id):
    page_size = request.args.get("page_size", 5000)

    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        items = data_source.items

        result_file = services.get_s3_object(data_source.result_parquet)
        file = pq.read_table(BufferReader(result_file["Body"].read()))

        return (
            create_response(
                get_paginated_list(
                    file, items, page=int(request.args.get("page", 1)), page_size=int(page_size),
                )
            ),
            200,
        )

    except Exception as e:
        logging.critical(f"Unable to get job results - {e}")
        return create_response({"error": f"{e}"}), 404


def get_paginated_list(file, items, page, page_size):
    rows_to_skip = (page - 1) * page_size
    count = items
    pages = math.ceil(count / page_size)

    obj = dict(count=count, pages=pages)

    if (rows_to_skip + 1) > count:
        obj["records"] = []
    else:
        obj["records"] = json.loads(
            file.slice(rows_to_skip, page_size)
            .to_pandas(strings_to_categorical=True)
            .to_json(orient="records")
        )

    return obj
