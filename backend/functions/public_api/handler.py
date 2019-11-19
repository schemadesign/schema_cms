import json
import logging

import math

from flask import Flask, abort, request, Response
from flask_cors import CORS

# from flask_compress import Compress
import pandas as pd
from pyarrow import BufferReader

from common import services, settings, types

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
CORS(app)
# Compress(app)


def create_response(data):
    return Response(
        json.dumps(data, ensure_ascii=False, indent=4), content_type="application/json; charset=utf-8"
    )


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def data_source_data(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        filters = data_source.filters
        fields = data_source.fields
        result_file = services.get_s3_object(data_source.result_parquet)
        file = BufferReader(result_file["Body"].read())
        records = json.loads(pd.read_parquet(file, engine="pyarrow").to_json(orient="index"))

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
    format_ = request.args.get("format", None)
    orient = request.args.get("orient", "index")

    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        items = data_source.items

        if format_ == "parquet":
            result_file = services.get_s3_object(data_source.result_parquet)
            file = BufferReader(result_file["Body"].read())
            records = json.loads(pd.read_parquet(file, engine="pyarrow").to_json(orient=orient))
            return create_response(records), 200
        else:
            result_file = services.get_s3_object(data_source.result)

    except Exception as e:
        logging.critical(f"Unable to get job results - {e}")
        return create_response({"error": "There is no available results"}), 404

    return (
        create_response(
            get_paginated_list(
                result_file,
                items,
                page=int(request.args.get("page", 1)),
                page_size=int(request.args.get("page_size", 10000)),
            )
        ),
        200,
    )


def get_paginated_list(s3obj, items, page, page_size):
    rows_to_skip = (page - 1) * page_size
    count = items
    pages = math.ceil(count / page_size)

    obj = dict()

    obj["count"] = count
    obj["pages"] = pages

    if (rows_to_skip + 1) > count:
        obj["results"] = []
    else:
        pan = pd.read_csv(s3obj["Body"], skiprows=range(1, rows_to_skip + 1), iterator=True)
        pan = pan.get_chunk(page_size)
        obj["results"] = json.loads(pan.to_json(orient="records"))

    return obj
