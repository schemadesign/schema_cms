# -*- coding: utf-8 -*-
from flask import redirect, blueprints, flash, request, url_for
from flask_admin import BaseView, expose
from flask_admin.contrib import sqla
from flask_login import current_user, logout_user, login_user

from gist.admin import forms as admin_forms
from gist.user import models as user_models
from gist.utils import flash_errors


_initialized = False
admin_login_blueprint = blueprints.Blueprint("admin_login", __name__)


class LoginAdminView(BaseView):
    @expose(methods=['GET', 'POST'])
    def index(self):
        form = admin_forms.AdminLoginForm(request.form)
        if request.method == "POST":
            if form.validate_on_submit():
                login_user(form.user)
                flash("You are logged in.", "success")
                redirect_url = request.args.get("next") or url_for("admin.index")
                return redirect(redirect_url)
            else:
                flash_errors(form)
        return self.render('admin_login/login.html', form=form)

    def is_accessible(self):
        return not current_user.is_authenticated


class LogoutAdminView(BaseView):
    @expose(methods=['GET'])
    def index(self):
        logout_user()
        flash("You are logged out.", "success")
        redirect_url = request.args.get("next") or url_for("admin.index")
        return redirect(redirect_url)

    def is_accessible(self):
        return current_user.is_authenticated


class BaseAdminViewMixin:
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin

    def inaccessible_callback(self, name, **kwargs):
        return redirect('/admin/login')


class UserAdminView(BaseAdminViewMixin, sqla.ModelView):
    page_size = 50
    column_exclude_list = ('password',)


class RoleAdminView(BaseAdminViewMixin, sqla.ModelView):
    page_size = 50
    column_exclude_list = ('user',)
    form_excluded_columns = ('user',)


def configure(admin, db):
    global _initialized
    if _initialized:
        return
    admin.add_view(UserAdminView(user_models.User, db.session))
    admin.add_view(RoleAdminView(user_models.Role, db.session))
    admin.add_view(LoginAdminView(name='Login', url='/admin/login'))
    admin.add_view(LogoutAdminView(name='Logout', url='/admin/logout'))
    _initialized = True
