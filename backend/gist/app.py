# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
import logging
import sys

from flask import Flask, jsonify

from gist import commands, admin as admin_app, public, user
from gist import extensions


def create_app(config_object="gist.settings"):
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split(".")[0])
    app.config.from_object(config_object)
    register_extensions(app)
    register_blueprints(app)
    register_errorhandlers(app)
    register_shellcontext(app)
    register_commands(app)
    configure_logger(app)
    configure_login(extensions.login_manager)
    configure_admin(extensions.admin, extensions.db)
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
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(admin_app.views.admin_login_blueprint)
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
            "User": user.models.User
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


def configure_login(login_manager):
    def load_user(user_id):
        return user.models.User.get_by_id(user_id)
    login_manager.user_loader(load_user)


def configure_admin(admin, db):
    admin_app.views.configure(admin, db)
