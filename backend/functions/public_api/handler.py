from dataclasses import asdict
import json
import logging

import math
import markdown2

from flask import Flask, request, Response, render_template
from flask_cors import CORS

from pyarrow import BufferReader
import pyarrow.parquet as pq

from common import services, settings, types, utils

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
CORS(app)


def create_response(data):
    return Response(
        json.dumps(data, ensure_ascii=True),
        content_type="application/json; charset=utf-8",
    )


def read_parquet_from_s3(data_source, columns=None, orient="index", slice_=True):
    result_file = services.get_s3_object(data_source.result_parquet)
    file = pq.read_table(BufferReader(result_file["Body"].read()), columns=columns)
    if slice_:
        return json.loads(
            file.slice(0, 10).to_pandas().to_json(orient=orient, date_format="iso")
        )
    else:
        return json.loads(file.to_pandas().to_json(orient=orient, date_format="iso"))


def split_string_to_list(column_names_string):
    if column_names_string:
        names_list = list(column_names_string.split(","))
        return names_list
    return None


# Projects endpoints


@app.route("/projects", methods=["GET"])
def get_projects():
    try:
        projects = types.Project.get_all_items()
    except Exception as e:
        logging.info(f"Unable to get projects - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(projects), 200


@app.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    try:
        project = types.Project.get_by_id(id=project_id)
    except Exception as e:
        logging.info(f"Unable to get project - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(asdict(project)), 200


# Pages endpoints


@app.route("/pages/<int:page_id>", methods=["GET"])
def get_page(page_id):
    try:
        format_ = request.args.get("format", None)
        page = types.Page.get_by_id(id=page_id)
    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    if format_ != "html":
        return create_response(asdict(page)), 200

    page.blocks = generate_html_from_markdown_blocks(page)

    return render_template("page_template.html", page=page)


def generate_html_from_markdown_blocks(page):
    new_blocks = []
    for block in page.blocks:
        if block["type"] == "markdown":
            block["content"] = markdown2.markdown(block["content"])
            new_blocks.append(block)
        else:
            new_blocks.append(block)

    return new_blocks


# Data Sources endpoints


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def get_data_source(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        records = read_parquet_from_s3(data_source)

    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    data = dict(**asdict(data_source))
    data.pop("file")
    data.pop("result")
    data["records"] = records

    return create_response(data), 200


@app.route("/datasources/<int:data_source_id>/meta", methods=["GET"])
def get_data_source_meta(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        meta = data_source.meta
    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(meta), 200


@app.route("/datasources/<int:data_source_id>/fields", methods=["GET"])
def get_data_source_fields(data_source_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        fields = data_source.fields
    except Exception as e:
        logging.info(f"Unable to get fields - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(fields), 200


@app.route(
    "/datasources/<int:data_source_id>/fields/<string:field_id>", methods=["GET"]
)
def get_data_source_selected_field(data_source_id, field_id):
    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        field = data_source.fields[field_id]
        records = read_parquet_from_s3(
            data_source, columns=[field["name"]], slice_=False
        )
    except Exception as e:
        logging.info(f"Unable to get fields - {e}")
        return create_response({"error": f"{e}"}), 404

    return (
        create_response(
            {
                "id": field_id,
                "name": field["name"],
                "type": field["type"],
                "records": records,
            }
        ),
        200,
    )


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
    columns_list_as_string = request.args.get("columns", None)
    orient = get_data_format(request.args.get("orient", "index"))
    columns = split_string_to_list(columns_list_as_string)

    try:
        data_source = types.DataSource.get_by_id(id=data_source_id)
        items = data_source.shape[0]

        result_file = services.get_s3_object(data_source.result_parquet)
        file = pq.read_table(BufferReader(result_file["Body"].read()), columns=columns)

        return (
            create_response(
                get_paginated_list(
                    file,
                    items,
                    page=int(request.args.get("page", 1)),
                    page_size=int(page_size),
                    orient=orient,
                )
            ),
            200,
        )

    except Exception as e:
        logging.critical(f"Unable to get job results - {e}")
        return create_response({"error": f"{e}"}), 404


def get_data_format(orient):
    if orient not in ["split", "records", "index", "columns", "values", "table"]:
        return "index"
    return orient


def get_paginated_list(file, items, page, page_size, orient):
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
            .to_json(orient=orient, date_format="iso")
        )

    return obj
