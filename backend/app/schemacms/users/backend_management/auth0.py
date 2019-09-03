from django import urls
from auth0.v3 import authentication
from auth0.v3 import management
from django.conf import settings
from django.core import exceptions

from . import base
from .. import constants
from .. import models


class Auth0UserManagement(base.BaseUserManagement):
    connection = "Username-Password-Authentication"

    def __init__(self):
        """Retrieve token and setup auth0 proxy"""

        self.domain = settings.USER_MGMT_AUTH0_DOMAIN
        if not self.domain:
            raise exceptions.ImproperlyConfigured(
                "Missing or invalid USER_MGMT_AUTH0_DOMAIN setting, got: {}".format(repr(self.domain))
            )
        self.token = self._get_token(self.domain)
        self.proxy = management.Auth0(self.domain, self.token)

    def create_user(self, user: models.User):
        # We need at least 1 big letter and 1 digit
        password = "".join(
            [
                type(user).objects.make_random_password(length=4, allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ"),
                type(user).objects.make_random_password(length=4, allowed_chars="23456789"),
                type(user).objects.make_random_password(length=4, allowed_chars="!@#$%^&*"),
                type(user).objects.make_random_password(length=4),
            ]
        )

        body = {
            "user_id": str(user.id),
            "email": user.email,
            "password": password,
            "connection": self.connection,
            "email_verified": False,
            "verify_email": False,
        }
        if user.first_name:
            body["given_name"] = user.first_name
        if user.last_name:
            body["family_name"] = user.first_name

        return self.proxy.users.create(body)

    def password_change_url(self, user: models.User):
        path = urls.reverse("social:begin", kwargs={"backend": "auth0"})
        body = {
            "result_url": "{host}{path}".format(host=settings.DEFAULT_HOST, path=path),
            "user_id": user.external_id,
            "ttl_sec": 0,
            "mark_email_as_verified": True,
        }
        return self.proxy.tickets.create_pswd_change(body)["ticket"]

    def get_user_source(self):
        return constants.UserSource.AUTH0

    @classmethod
    def _get_token(cls, domain):
        get_token = authentication.GetToken(domain)
        token = get_token.client_credentials(
            settings.USER_MGMT_AUTH0_KEY, settings.USER_MGMT_AUTH0_SECRET, "https://{}/api/v2/".format(domain)
        )
        return token["access_token"]
