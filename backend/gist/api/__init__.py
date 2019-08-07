# -*- coding: utf-8 -*-
from . import blueprints
from . import resources   # noqa


def configure(api):
    api.add_resource(resources.Me, '/me')
    api.blueprint = blueprints.default_blueprint
