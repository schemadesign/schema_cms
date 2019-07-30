# -*- coding: utf-8 -*-
"""Public section"""
from flask import Blueprint, jsonify

blueprint = Blueprint("public", __name__, static_folder="../static")


@blueprint.route("/", methods=["GET"])
def home():
    return jsonify({'msg': 'OK'})
