# -*- coding: utf-8 -*-
from . import blueprints  # noqa
from . import views  # noqa
from gist.auth import models as auth_models
from gist.user import models as user_models

_initialized = False


def configure(admin, db):
    global _initialized
    if _initialized:
        return
    admin.add_view(views.UserAdminView(user_models.User, db.session))
    admin.add_view(views.RoleAdminView(user_models.Role, db.session))
    admin.add_view(views.UserAuthAdminView(auth_models.UserAuth, db.session))
    admin.add_view(views.LoginAdminView(name='Login', url='/admin/login'))
    admin.add_view(views.LogoutAdminView(name='Logout', url='/admin/logout'))
    _initialized = True
