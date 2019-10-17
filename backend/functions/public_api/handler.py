import logging
from flask import Flask, jsonify, abort, request
import pandas as pd

import db
import settings
import services


logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
db.initialize()


@app.route("/datasources/<int:data_source_id>", methods=['GET'])
def data_source_results(data_source_id):
    try:
        last_result = db.Job.select().where(
                    (db.Job.datasource == data_source_id) & (db.Job.job_state == 'success')
                ).order_by(-db.Job.id).get().result
        meta_data = db.DataSourceMeta.select().where(db.DataSourceMeta.datasource == data_source_id).get()
    except Exception as e:
        logging.critical(f"Unable to get job results from db - {e}")
        return jsonify({"message": "There is no available results"}), 404

    result_file = services.s3.get_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=last_result.lstrip("/")
    )

    return jsonify(
        get_paginated_list(
            result_file,
            meta_data,
            page=int(request.args.get('page', 1)),
            page_size=int(request.args.get('page_size', 1000))
        )
    ), 200


def get_paginated_list(df, meta_data, page, page_size):
    rows_to_skip = (page-1) * page_size
    count = meta_data.items
    pages = int(count / page_size)

    obj = dict()

    obj['count'] = count
    obj['pages'] = pages

    if (rows_to_skip + 1) > count:
        obj['results'] = []
    else:
        pan = pd.read_csv(df["Body"], skiprows=range(1, rows_to_skip+1), iterator=True)
        pan = pan.get_chunk(page_size)
        obj['results'] = pan.to_json(orient="records")

    return obj
