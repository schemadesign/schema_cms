from urllib import parse
import requests

import anymail.exceptions
import sentry_sdk
from django import urls
from django.conf import settings
from django.core import exceptions
from social_core.backends.okta import OktaOAuth2

from . import base
from .. import constants
from .. import models
from schemacms import mail


class UserDontExistInOkta(Exception):
    message = "The user with this email does not exists in Okta instance."


class ExtendedOktaOAuth2(OktaOAuth2):
    name = "okta-oauth2"
    REDIRECT_STATE = False
    ACCESS_TOKEN_METHOD = "POST"
    SCOPE_SEPARATOR = " "
    ID_KEY = "preferred_username"

    DEFAULT_SCOPE = ["openid", "profile", "email"]
    EXTRA_DATA = [
        ("refresh_token", "refresh_token", True),
        ("expires_in", "expires"),
        ("token_type", "token_type", True),
    ]

    def get_user_details(self, response):
        """Return user details from Okta account"""
        return {
            "user_id": response.get("sub"),
            "username": response.get("preferred_username"),
            "email": response.get("email") or "",
            "first_name": response.get("given_name"),
            "last_name": response.get("family_name"),
            "email_verified": response.get("email_verified"),
        }


class OktaUserManagement(base.BaseUserManagement):
    type = constants.UserSource.OKTA

    def __init__(self):
        self.domain = settings.OKTA_DOMAIN_URL

        if not self.domain:
            raise exceptions.ImproperlyConfigured(
                "Missing or invalid OKTA_DOMAIN_URL setting, got: {}".format(repr(self.domain))
            )

    @property
    def token(self):
        return settings.OKTA_API_TOKEN

    @property
    def base_headers(self):
        return {
            "Authorization": f"SSWS {self.token}",
            "Content-Type": "application/json",
        }

    def post(self, endpoint, data, params=None):
        return requests.post(
            f"{self.domain}/api/v1/{endpoint}", json=data, params=params, headers=self.base_headers
        )

    def get(self, endpoint, params=None):
        return requests.get(f"{self.domain}/api/v1/{endpoint}", params=params, headers=self.base_headers)

    def create_user(self, user: models.User):
        endpoint = "users"
        password = self._generate_password()
        data = {
            "profile": {
                "firstName": user.first_name or "-",
                "lastName": user.last_name or "-",
                "email": user.email,
                "login": user.email,
            },
            "credentials": {"password": {"value": password}},
        }

        params = {"activate": "true", "nextLogin": "changePassword"}

        return self.post(endpoint, data, params)

    def get_user(self, email):
        request = self.get(f"users/{email}")

        if request.status_code == 404:
            raise UserDontExistInOkta

        return request.json()

    def delete_user(self, user) -> bool:
        return True

    def get_user_source(self):
        return constants.UserSource.OKTA

    def get_login_url(self, **kwargs):
        path = urls.reverse("social:begin", kwargs={"backend": "okta-oauth2"})

        return "{host}{path}".format(host=settings.DEFAULT_HOST, path=path)

    def get_logout_url(self, return_to=None, **kwargs):
        if not return_to:
            return_to = self.get_login_url()

        id_token = kwargs.get("okta-oauth2-id-token")

        if not id_token:
            return f"{settings.DEFAULT_WEBAPP_HOST}/auth/login"

        params = {
            "post_logout_redirect_uri": return_to,
            "id_token_hint": id_token,
            "state": kwargs.get("email"),
        }

        return f"{settings.SOCIAL_AUTH_OKTA_OAUTH2_API_URL}/v1/logout?{parse.urlencode(params)}"

    def send_schema_invite(self, user: models.User):
        body = (
            "Welcome to Schema CMS! Please click the following link and sign in using"
            "Okta account to get started:\n"
            f"{settings.DEFAULT_WEBAPP_HOST}/auth/login"
        )

        try:
            mail.send_message(
                email=user.email,
                template=mail.EmailTemplate.INVITATION_OKTA,
                body=body,
                subject="Welcome to Schema CMS!",
            )
            return True
        except anymail.exceptions.AnymailRequestsAPIError as e:
            sentry_sdk.capture_exception(e)
            return False
