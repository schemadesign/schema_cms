import auth0.v3
import django.contrib.messages
from django import urls
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db import transaction
from django.utils.translation import gettext_lazy as _

from . import models as user_models
from . import backend_management
from . import admin_forms


@admin.register(user_models.User)
class UserAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "source", "role")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions", "role")},
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Auth"), {"fields": ("source", "external_id")}),
    )
    add_form_template = "users/admin/add_form.html"
    change_list_template = "users/admin/change_list.html"
    invite_user_form = admin_forms.InviteUserForm
    invite_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "first_name", "last_name", "role")}),
    )

    def get_urls(self):
        return [
            urls.path("invite-user/", self.admin_site.admin_view(self.add_view), name="invite_user")
        ] + super().get_urls()

    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        sid = transaction.savepoint()
        super().save_model(request, obj, form, change)
        if not change and obj.email:
            try:
                ret = backend_management.user_mgtm_backend.create_user(obj)
            except auth0.v3.Auth0Error as e:
                transaction.savepoint_rollback(sid)
                if e.status_code == 409:
                    return self.message_user(
                        request, f"{obj.email} already exist in Auth0", django.contrib.messages.ERROR
                    )
                self.message_user(
                    request, 'Error from auth0: "{}"'.format(e.message), django.contrib.messages.ERROR
                )
                raise
            obj.source = backend_management.user_mgtm_backend.get_user_source()
            obj.external_id = ret["user_id"]
            obj.save(update_fields=["source", "external_id"])
            transaction.on_commit(obj.send_invitation_email)
        transaction.savepoint_commit(sid)
        return obj

    def get_fieldsets(self, request, obj=None):
        if self._is_invite_user_request(request):
            return self.invite_fieldsets
        return super().get_fieldsets(request, obj)

    def get_form(self, request, obj=None, **kwargs):
        """
        Use special form during user creation
        """
        defaults = {}
        if obj is None:
            if self._is_invite_user_request(request):
                defaults["form"] = self.invite_user_form
            else:
                defaults["form"] = self.add_form
        defaults.update(kwargs)
        return super().get_form(request, obj, **defaults)

    def _is_invite_user_request(self, request):
        return request.path == urls.reverse("admin:invite_user")
