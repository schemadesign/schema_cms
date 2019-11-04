import logging
import math
import os

from flask import Flask, jsonify, abort, request
import requests
import pandas as pd

from common import services, settings

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def data_source_results(data_source_id):
    try:

        url = os.path.join(
            settings.BACKEND_URL, "datasources", str(data_source_id), "public-results"
        )
        data = requests.get(url)

        if data.status_code == 404:
            return jsonify({"message": f"Datasource {data_source_id} does not exist"}), 404

        items = data.json().get("items")
        result = data.json().get("result")

    except Exception as e:
        logging.critical(f"Unable to get job results - {e}")
        return jsonify({"message": "There is no available results"}), 404

    result_file = services.s3.get_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=result
    )

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


def get_paginated_list(df, items, page, page_size):
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
            df["Body"], skiprows=range(1, rows_to_skip + 1), iterator=True
        )
        pan = pan.get_chunk(page_size)
        obj["results"] = pan.to_json(orient="records")

    return obj
