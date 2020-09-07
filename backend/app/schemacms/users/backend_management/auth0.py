from urllib import parse

import anymail.exceptions
import auth0.v3
import sentry_sdk

from auth0.v3 import authentication
from auth0.v3 import management

from django import urls
from django.conf import settings
from django.core import exceptions

from schemacms import mail

from . import base
from .. import constants
from .. import models


class Auth0UserManagement(base.BaseUserManagement):
    connection = "Username-Password-Authentication"
    type = constants.UserSource.AUTH0

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

        ids_to_delete = self.get_user_auth0_instances(user.email)
        ids_to_delete.add(user.external_id)

        try:
            for external_id in ids_to_delete:
                self.proxy.users.delete(external_id)
        except Exception as e:
            return f"Unable to remove user from Auth0 - {e}"

        return True

    def get_user_auth0_instances(self, user_email):
        instances = self.proxy.users_by_email.search_users_by_email(email=user_email, fields=["identities"])

        external_ids = set()

        for instance in instances:
            for identity in instance["identities"]:
                external_ids.add(f"{identity['provider']}|{identity['user_id']}")

        return external_ids

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

    def get_logout_url(self, return_to=None, **kwargs):
        """Return logout url to auth0 logout page and then after logout redirect to
        BE auth0 login endpoint.
        """
        if not return_to:
            return_to = self.get_login_url()

        params = {"returnTo": return_to, "client_id": settings.SOCIAL_AUTH_AUTH0_KEY}

        return f"https://{settings.SOCIAL_AUTH_AUTH0_DOMAIN}/v2/logout?{parse.urlencode(params)}"

    @classmethod
    def _get_token(cls, domain):
        get_token = authentication.GetToken(domain)
        token = get_token.client_credentials(
            settings.USER_MGMT_AUTH0_KEY, settings.USER_MGMT_AUTH0_SECRET, "https://{}/api/v2/".format(domain)
        )
        return token["access_token"]

    def send_schema_invite(self, user: models.User):
        url = self.password_change_url(user)

        try:
            mail.send_message(
                email=user.email,
                template=mail.EmailTemplate.INVITATION_AUTH0,
                subject="Welcome to Schema CMS!",
                merge_data_dict={"url": url},
            )
            return True
        except anymail.exceptions.AnymailRequestsAPIError as e:
            sentry_sdk.capture_exception(e)
            return False
