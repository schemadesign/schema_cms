import auth0.v3
import django.core.exceptions
import django.contrib.messages
from django import urls
from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin
from django.db import transaction
from django.utils.translation import gettext_lazy as _

from schemacms.users import signals
from . import models as user_models
from . import admin_forms


def activate_users(modeladmin, request, queryset):
    with transaction.atomic():
        queryset.update(is_active=True)


def deactivate_users(modeladmin, request, queryset):
    fail_to_deactivate_users = []
    for user in queryset:
        try:
            with transaction.atomic():
                user.deactivate(requester=request.user)
        except Exception:  # noqa
            fail_to_deactivate_users.append(user)
    if fail_to_deactivate_users:
        modeladmin.message_user(
            request=request,
            message=_(
                "The system could not deactivate the following users: {}".format(
                    ", ".join(fail_to_deactivate_users)
                )
            ),
            level=messages.ERROR,
        )


@admin.register(user_models.User)
class UserAdmin(UserAdmin):
    actions = (activate_users, deactivate_users)
    list_display = ("email", "first_name", "last_name", "is_active", "is_staff", "source", "role")
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (_("Permissions"), {"fields": ("role", "is_active", "is_staff", "is_superuser")},),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Auth"), {"fields": ("source", "external_id")}),
    )
    readonly_fields = ("is_active",)
    add_form_template = "users/admin/add_form.html"
    change_list_template = "users/admin/change_list.html"
    form = admin_forms.UserChangeForm
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
                signals.user_invited.send(sender=user_models.User, user=obj, requester=request.user)
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
