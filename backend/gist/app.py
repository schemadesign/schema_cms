# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
import logging
import sys

from flask import Flask, jsonify
import flask_jwt_extended

from gist import (commands, admin as admin_app, auth, api, public, user as user_app)
from gist import extensions


def create_app(config_object="gist.settings"):
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split(".")[0])
    app.config.from_object(config_object)
    register_extensions(app)
    for configure_fn in (configure_logger, configure_login, configure_admin, configure_oauth, configure_api):
        configure_fn(app)
    register_blueprints(app)
    register_errorhandlers(app)
    register_shellcontext(app)
    register_commands(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    extensions.bcrypt.init_app(app)
    extensions.cache.init_app(app)
    extensions.db.init_app(app)
    extensions.csrf_protect.init_app(app)
    extensions.login_manager.init_app(app)
    extensions.migrate.init_app(app, extensions.db)
    extensions.webpack.init_app(app)
    extensions.admin.init_app(app)
    extensions.oauth.init_app(app)
    extensions.api.init_app(api.blueprints.default_blueprint)
    extensions.jwt.init_app(app)
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(admin_app.blueprints.default_blueprint)
    app.register_blueprint(auth.blueprints.default_blueprint, url_prefix='/auth')
    app.register_blueprint(api.blueprints.default_blueprint, url_prefix='/api')
    return None


def register_errorhandlers(app):
    """Register error handlers."""

    def render_error(error):
        """Render error template."""
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, "code", 500)
        return jsonify({'error_code': error_code})

    for errcode in [401, 403, 404, 500]:
        app.errorhandler(errcode)(render_error)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {
            "db": extensions.db,
            "bcrypt": extensions.bcrypt,
            "User": user_app.models.User
        }

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.createsuperuser)


def configure_logger(app):
    """Configure loggers."""
    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)


def configure_login(app):
    def load_user(user_id):
        return user_app.models.User.get_by_id(user_id)

    def load_user_from_request(request):
        flask_jwt_extended.verify_jwt_in_request()
        identity = flask_jwt_extended.get_jwt_identity()
        if identity:
            return user_app.models.User.get_by_id(identity)
        return None
    extensions.login_manager.user_loader(load_user)
    extensions.login_manager.request_loader(load_user_from_request)
    extensions.login_manager.blueprint_login_views = {
        'admin': '/admin/login'
    }


def configure_admin(app):
    admin_app.configure(extensions.admin, extensions.db)


def configure_oauth(app):
    auth.configure(app, extensions.oauth)


def configure_api(app):
    api.configure(extensions.api)
