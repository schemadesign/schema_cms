import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from rest_framework_jwt.settings import api_settings

from . import backend_management, constants, signals, managers
from ..authorization import tokens

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


@python_2_unicode_compatible
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.CharField(
        choices=constants.USER_SOURCE_CHOICES, max_length=16, default=constants.UserSource.UNDEFINED
    )
    external_id = models.CharField(max_length=64, blank=True)
    email = models.EmailField(_("email address"), blank=True, unique=True)
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Select an action from admin panel to change this instead of deleting accounts."
        ),
    )

    role = models.CharField(
        max_length=25,
        choices=constants.USER_ROLE_CHOICES,
        default=constants.UserRole.UNDEFINED,
        db_index=True,
    )

    objects = managers.UserManager()

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        super().save(*args, **kwargs)

    @property
    def is_admin(self):
        return self.role == constants.UserRole.ADMIN

    @property
    def is_editor(self):
        return self.role == constants.UserRole.EDITOR

    def __str__(self):
        return self.get_full_name()

    @classmethod
    def generate_random_username(cls):
        return uuid.uuid4().hex

    def get_exchange_token(self):
        return tokens.exchange_token.make_token(self)

    def get_jwt_token(self, auth_method=None):
        token = jwt_payload_handler(self, extra_data={"auth_method": auth_method, "role": self.role})
        return jwt_encode_handler(token)

    def send_invitation_email(self) -> bool:
        return backend_management.user_mgtm_backend.send_schema_invite(self)

    def assign_external_account(self):
        if backend_management.user_mgtm_backend.type == "auth0":
            user_id = backend_management.user_mgtm_backend.create_user(self)["user_id"]

        if backend_management.user_mgtm_backend.type == "okta":
            user_id = backend_management.user_mgtm_backend.get_user(self.email)["id"]

        self.source = backend_management.user_mgtm_backend.get_user_source()
        self.external_id = user_id
        self.save(update_fields=["source", "external_id"])

    @transaction.atomic()
    def deactivate(self, requester=None) -> bool:
        if not self.is_active:
            return False
        self.is_active = False
        self.save(update_fields=["is_active"])
        signals.user_deactivated.send(sender=self.__class__, user=self, requester=requester)
        return True
