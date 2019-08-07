# -*- coding: utf-8 -*-
from . import blueprints  # noqa
from . import helpers
from . import models  # noqa
from . import views   # noqa


def configure(app, oauth):
    helpers.Auth0Helper(app).register(oauth)
