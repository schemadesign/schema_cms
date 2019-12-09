from dataclasses import asdict
import json
import logging

import math

from flask import Flask, abort, request, Response
from flask_cors import CORS

import pandas as pd
from pyarrow import BufferReader
import pyarrow.parquet as pq

from common import services, settings, types

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
CORS(app)


def columns_to_records(pydict):
    return [dict(zip(pydict, i)) for i in zip(*pydict.values())]


def create_response(data):
    return Response(
        json.dumps(data, ensure_ascii=False, indent=4),
        content_type="application/json; charset=utf-8",
    )


@app.route("/projects/<int:project_id>", methods=["GET"])
def project_data(project_id):
    try:
        project = types.Project.get_by_id(id=project_id)
    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(asdict(project)), 200


@app.route("/projects/<int:project_id>/pages", methods=["GET"])
def project_pages(project_id):
    try:
        project = types.Project.get_by_id(id=project_id)
        pages = project.pages
    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(pages), 200


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def data_source_data(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        filters = data_source.filters
        fields = data_source.fields
        result_file = services.get_s3_object(data_source.result_parquet)
        file = pq.read_table(BufferReader(result_file["Body"].read()))
        records = columns_to_records(file.to_pydict())

    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    data = {"meta": {}, "fields": fields, "filters": filters, "records": records}

    return create_response(data), 200


@app.route("/datasources/<int:data_source_id>/fields", methods=["GET"])
def data_source_fields(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        fields = data_source.fields
    except Exception as e:
        logging.info(f"Unable to get fields - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(fields), 200


@app.route("/datasources/<int:data_source_id>/filters", methods=["GET"])
def data_source_filters(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        filters = data_source.filters
    except Exception as e:
        logging.info(f"Unable to get filters - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(filters), 200


@app.route("/datasources/<int:data_source_id>/records", methods=["GET"])
def data_source_results(data_source_id):
    page_size = request.args.get("page_size", None)

    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        items = data_source.items

        result_file = services.get_s3_object(data_source.result_parquet)
        file = pq.read_table(BufferReader(result_file["Body"].read()))

        if not page_size:
            data_dict = file.to_pydict()
            records = columns_to_records(data_dict)
            return create_response(records), 200
        else:
            return (
                create_response(
                    get_paginated_list(
                        file,
                        items,
                        page=int(request.args.get("page", 1)),
                        page_size=int(page_size),
                    )
                ),
                200,
            )

    except Exception as e:
        logging.critical(f"Unable to get job results - {e}")
        return create_response({"error": f"There is no available results"}), 404


def get_paginated_list(file, items, page, page_size):
    rows_to_skip = (page - 1) * page_size
    count = items
    pages = math.ceil(count / page_size)

    obj = dict()

    obj["count"] = count
    obj["pages"] = pages

    if (rows_to_skip + 1) > count:
        obj["records"] = []
    else:
        sliced_data = file.slice(rows_to_skip, page_size).to_pydict()
        obj["records"] = columns_to_records(sliced_data)

    return obj
