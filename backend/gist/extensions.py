# -*- coding: utf-8 -*-
"""Extensions module. Each extension is initialized in the app factory located in app.py."""
from flask_bcrypt import Bcrypt
from flask_caching import Cache
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_webpack import Webpack
from flask_admin import Admin
from flask_wtf.csrf import CSRFProtect
from authlib.flask.client import OAuth
from flask_jwt_extended import JWTManager
from flask_restful import Api

bcrypt = Bcrypt()
csrf_protect = CSRFProtect()
login_manager = LoginManager()
db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
webpack = Webpack()
admin = Admin(name='Schema CMS', template_mode='bootstrap3')
oauth = OAuth()
api = Api()
jwt = JWTManager()
