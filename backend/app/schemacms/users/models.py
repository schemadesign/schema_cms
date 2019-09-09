import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.encoding import python_2_unicode_compatible
from rest_framework_jwt.settings import api_settings

from schemacms import mail
from schemacms.authorization import tokens
from . import backend_management, constants

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


@python_2_unicode_compatible
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.CharField(
        choices=constants.USER_SOURCE_CHOICES, max_length=16, default=constants.UserSource.UNDEFINED
    )
    external_id = models.CharField(max_length=64, blank=True)

    role = models.CharField(
        max_length=25, choices=constants.USER_ROLE_CHOICES, default=constants.UserRole.UNDEFINED
    )

    @property
    def is_admin(self):
        return self.role == constants.UserRole.ADMIN

    def __str__(self):
        return self.username

    def get_exchange_token(self):
        return tokens.exchange_token.make_token(self)

    def get_jwt_token(self):
        token = jwt_payload_handler(self)
        return jwt_encode_handler(token)

    def send_invitation_email(self):
        url = backend_management.user_mgtm_backend.password_change_url(self)
        mail.send_message(
            email=self.email,
            template=mail.MandrillTemplate.INVITATION,
            subject="Invitation",
            merge_data_dict={"url": url},
        )
