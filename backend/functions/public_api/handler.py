import json
import logging

import math

from flask import Flask, request, Response, render_template, views
from flask_cors import CORS

from pyarrow import BufferReader
import pyarrow.parquet as pq

from common import db, services, settings, types, utils

logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
db.initialize()
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
        projects = [
            project.as_dict()
            for project in db.Project.select()
            .where(db.Project.deleted_at == None)
            .order_by(db.Project.id)
        ]

    except Exception as e:
        logging.info(f"Unable to get projects - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(projects), 200


@app.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    try:
        project = db.Project.select().where(db.Project.id == project_id).get().as_dict()

    except db.Project.DoesNotExist:
        return create_response({"error": "Project does not exist"})

    except Exception as e:
        logging.info(f"Unable to get project - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(project), 200


@app.route("/projects/<int:project_id>/datasources", methods=["GET"])
def get_project_data_sources(project_id):
    try:
        page_size = int(request.args.get("page_size", 20))
        page_number = int(request.args.get("page_number", 1))

        data_sources = [
            data_source.as_dict_list()
            for data_source in db.DataSource.select()
            .where(db.DataSource.project_id == project_id)
            .order_by(db.DataSource.created)
            .paginate(page_number, page_size)
        ]

    except Exception as e:
        logging.info(f"Unable to get project - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(data_sources), 200


@app.route("/projects/<int:project_id>/pages", methods=["GET"])
def get_project_pages(project_id):
    try:
        pages = [
            page.as_dict()
            for page in db.Page.select().where(
                db.Page.project_id == project_id,
                db.Page.deleted_at == None,
                db.Page.is_public == True,
            )
        ]

    except Exception as e:
        logging.info(f"Unable to get project - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(pages), 200


# Pages endpoints


@app.route("/sections/<int:section_id>", methods=["GET"])
def get_section(section_id):
    try:
        project = db.Section.select().where(db.Section.id == section_id).get().as_dict()

    except db.Section.DoesNotExist:
        return create_response({"error": "Section does not exist"})

    except Exception as e:
        logging.info(f"Unable to get project - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(project), 200


@app.route("/pages/<int:page_id>", methods=["GET"])
def get_page(page_id):
    try:
        format_ = request.args.get("format", None)
        page = (
            db.Page.select()
            .where(
                db.Page.id == page_id,
                db.Page.deleted_at == None,
                db.Page.is_public == True,
            )
            .get()
            .as_dict_detail()
        )

    except db.Page.DoesNotExist:
        return create_response({"error": "Page does not exist"}), 404

    except Exception as e:
        logging.info(f"Unable to get page - {e}")
        return create_response({"error": f"{e}"}), 404

    if format_ != "html":
        return create_response(page), 200

    return render_template("page_template.html", page=page)


# Data Sources endpoints


@app.route("/datasources", methods=["GET"])
def get_data_sources():
    try:
        page_size = int(request.args.get("page_size", 20))
        page_number = int(request.args.get("page_number", 1))

        data_sources = [
            data_source.as_dict_list()
            for data_source in db.DataSource.select()
            .where(db.DataSource.deleted_at == None)
            .order_by(db.DataSource.id)
            .paginate(page_number, page_size)
        ]

    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(data_sources), 200


@app.route("/datasources/<int:data_source_id>", methods=["GET"])
def get_data_source(data_source_id):
    try:
        data_source = (
            db.DataSource.select().where(db.DataSource.id == data_source_id).get()
        )
        records = read_parquet_from_s3(data_source)

    except db.DataSource.DoesNotExist:
        return create_response({"error": "Data Source does not exist"})

    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    data = data_source.as_dict()
    data["records"] = records

    return create_response(data), 200


@app.route("/datasources/<int:data_source_id>/meta", methods=["GET"])
def get_data_source_meta(data_source_id):
    try:
        data_source = (
            db.DataSource.select().where(db.DataSource.id == data_source_id).get()
        )
        meta = data_source.as_dict()["meta"]

    except db.DataSource.DoesNotExist:
        return create_response({"error": "Data Source does not exists"})

    except Exception as e:
        logging.info(f"Unable to get data source - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(meta), 200


@app.route("/datasources/<int:data_source_id>/fields", methods=["GET"])
def get_data_source_fields(data_source_id):
    try:
        data_source = (
            db.DataSource.select().where(db.DataSource.id == data_source_id).get()
        )
        fields = data_source.get_fields()

    except db.DataSource.DoesNotExist:
        return create_response({"error": "Data Source does not exist"})

    except Exception as e:
        logging.info(f"Unable to get fields - {e}")
        return create_response({"error": f"{e}"}), 404

    return create_response(fields), 200


@app.route(
    "/datasources/<int:data_source_id>/fields/<string:field_id>", methods=["GET"]
)
def get_data_source_selected_field(data_source_id, field_id):
    try:
        data_source = (
            db.DataSource.select().where(db.DataSource.id == data_source_id).get()
        )
        field = data_source.get_fields()[field_id]
        records = read_parquet_from_s3(
            data_source, columns=[field["name"]], slice_=False
        )

    except db.DataSource.DoesNotExist:
        return create_response({"error": "Data Source does not exist"})

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
        data_source = (
            db.DataSource.select().where(db.DataSource.id == data_source_id).get()
        )
        filters = data_source.get_filters()

    except db.DataSource.DoesNotExist:
        return create_response({"error": "Data Source does not exist"})

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
        data_source = (
            db.DataSource.select().where(db.DataSource.id == data_source_id).get()
        )
        items = data_source.result_shape[0]

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

    except db.DataSource.DoesNotExist:
        return create_response({"error": "Data Source does not exist"})

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
