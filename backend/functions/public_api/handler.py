import json
import logging

import math

from flask import Flask, jsonify, abort, request
from flask_cors import CORS
import pandas as pd

from common import services, settings, types

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
CORS(app)


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def data_source_results(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        items = data_source.items
        result_file = services.get_s3_object(data_source.result)
    except Exception as e:
        logging.critical(f"Unable to get job results - {e}")
        return jsonify({"message": "There is no available results"}), 404

    return (
        jsonify(
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
        pan = pd.read_csv(
            s3obj["Body"], skiprows=range(1, rows_to_skip + 1), iterator=True
        )
        pan = pan.get_chunk(page_size)
        obj["results"] = json.loads(pan.to_json(orient="records"))

    return obj
