import logging

from flask import Flask

import db


logger = logging.getLogger()
logger.setLevel(logging.INFO)


app = Flask(__name__)
# db.initialize()


@app.route("/")
def hello():
    return "Hello, World!"
