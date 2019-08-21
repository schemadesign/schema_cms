import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.encoding import python_2_unicode_compatible
from rest_framework_jwt.settings import api_settings

from schemacms.authorization import tokens


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


@python_2_unicode_compatible
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.username

    def get_exchange_token(self):
        return tokens.exchange_token.make_token(self)

    def get_jwt_token(self):
        token = jwt_payload_handler(self)
        return jwt_encode_handler(token)
