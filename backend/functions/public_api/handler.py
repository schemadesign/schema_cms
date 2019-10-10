import logging

from flask import Flask, jsonify, abort, request
import datatable as dt

import db
import settings
import services


logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
db.initialize()


@app.route("/datasources/<int:data_source_id>")
def data_source_results(data_source_id):
    try:
        last_result = db.Job.select().where(
                    (db.Job.datasource == data_source_id) & (db.Job.job_state == 'success')
                ).order_by(-db.Job.id).get().result
    except Exception as e:
        logging.critical(f"Unable to get job results from db - {e}")
        return jsonify({"message": "There is no available results"}), 404

    result_file = services.s3.get_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=last_result.lstrip("/")
    )

    return jsonify(
        get_paginated_list(
            result_file,
            f"/datasources/{data_source_id}",
            page=int(request.args.get('page', 1)),
            page_size=int(request.args.get('page_size', 1000))
        )
    ), 200


def get_paginated_list(df, url, page, page_size):
    pan = dt.fread(df["Body"])
    count = pan.shape[0]

    obj = dict()

    obj['count'] = count
    if page == 1:
        obj['previous'] = None
    else:
        start_copy = max(1, page - 1)
        obj['previous'] = url + '?page=%d&page_size=%d' % (start_copy, page_size)

    if page * page_size > count:
        obj['next'] = None
    else:
        start_copy = page + 1
        obj['next'] = url + '?page=%d&page_size=%d' % (start_copy, page_size)

    if page == 1:
        obj['results'] = pan[(page - 1):page_size, :].to_pandas().to_json(orient="records")
    else:
        start = (page - 1) * page_size
        end = start + page_size
        obj['results'] = pan[start:end, :].to_pandas().to_json(orient="records")

    return obj
