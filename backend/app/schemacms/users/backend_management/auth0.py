from urllib import parse

import auth0.v3
from django import urls
from auth0.v3 import authentication
from auth0.v3 import management
from django.conf import settings
from django.core import exceptions
from django.utils import crypto

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

    @property
    def token(self):
        """Retrieve a new token from auth0"""
        return self._get_token(self.domain)

    @property
    def proxy(self):
        """Returns initialized management.Auth0 object with token"""
        return management.Auth0(self.domain, self.token)

    def create_user(self, user: models.User):
        body = {
            "user_id": str(user.id),
            "email": user.email,
            "password": self._generate_password(),
            "connection": self.connection,
            "email_verified": False,
            "verify_email": False,
            "given_name": user.first_name or "-",
            "family_name": user.last_name or "-",
        }
        return self.proxy.users.create(body)

    def delete_user(self, user) -> bool:
        if not user.external_id:
            return False
        return self.proxy.users.delete(user.external_id)

    def password_change_url(self, user: models.User):
        login_url = self.get_login_url()
        body = {
            "result_url": login_url,
            "user_id": user.external_id,
            "ttl_sec": 0,
            "mark_email_as_verified": True,
        }
        try:
            return self.proxy.tickets.create_pswd_change(body)["ticket"]
        except auth0.v3.Auth0Error as e:
            if e.error_code == "operation_not_supported":
                return login_url
            raise

    def get_user_source(self):
        return constants.UserSource.AUTH0

    def get_login_url(self):
        path = urls.reverse("social:begin", kwargs={"backend": "auth0"})
        return "{host}{path}".format(host=settings.DEFAULT_HOST, path=path)

    def get_logout_url(self, return_to=None):
        """Return logout url to auth0 logout page and then after logout redirect to
        BE auth0 login endpoint.
        """
        if not return_to:
            return_to = self.get_login_url()
        params = {'returnTo': return_to, 'client_id': settings.SOCIAL_AUTH_AUTH0_KEY}
        return f'https://{settings.SOCIAL_AUTH_AUTH0_DOMAIN}/v2/logout?{parse.urlencode(params)}'

    @classmethod
    def _get_token(cls, domain):
        get_token = authentication.GetToken(domain)
        token = get_token.client_credentials(
            settings.USER_MGMT_AUTH0_KEY, settings.USER_MGMT_AUTH0_SECRET, "https://{}/api/v2/".format(domain)
        )
        return token["access_token"]

    @classmethod
    def _generate_password(cls):
        return "".join(
            [
                crypto.get_random_string(length=4, allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ"),
                crypto.get_random_string(length=4, allowed_chars="23456789"),
                crypto.get_random_string(length=4, allowed_chars="!@#$%^&*"),
                crypto.get_random_string(length=4),
            ]
        )
