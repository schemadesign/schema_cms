# -*- coding: utf-8 -*-
"""Application configuration.

Most configuration is set via environment variables.

For local development, use a .env file to set
environment variables.
"""
from environs import Env

env = Env()
env.read_env()

ENV = env.str("FLASK_ENV", default="production")
DEBUG = ENV == "development"
SQLALCHEMY_DATABASE_URI = env.str("DATABASE_URL")
SECRET_KEY = env.str("SECRET_KEY")
JWT_SECRET_KEY = env.str("SECRET_KEY")
JWT_ACCESS_TOKEN_EXPIRES = env.int(name="JWT_ACCESS_TOKEN_EXPIRES", default=259_200)  # 3 days
BCRYPT_LOG_ROUNDS = env.int("BCRYPT_LOG_ROUNDS", default=13)
DEBUG_TB_ENABLED = DEBUG
DEBUG_TB_INTERCEPT_REDIRECTS = False
CACHE_TYPE = "simple"  # Can be "memcached", "redis", etc.
SQLALCHEMY_TRACK_MODIFICATIONS = False
WEBPACK_MANIFEST_PATH = "webpack/manifest.json"
AUTH_SETTINGS = {
    "auth0": {
        "CLIENT_ID": env.str("AUTH_AUTH0_CLIENT_ID"),
        "CLIENT_SECRET": env.str("AUTH_AUTH0_CLIENT_SECRET"),
        "DOMAIN": env.str("AUTH_AUTH0_DOMAIN"),
    },
}
