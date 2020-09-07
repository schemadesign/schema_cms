from urllib import parse
from django import shortcuts
from django.conf import settings
from django.core import signing

from schemacms.authorization import constants as auth_constants
from schemacms.users import constants, models, backend_management


def generate_signed_exchange_token(user):
    return signing.dumps(
        {
            "uid": user.id,
            "auth_method": auth_constants.JWTAuthMethod.get_method_from_auth0(user.external_id),
            "token": user.get_exchange_token(),
        }
    )


def social_user(backend, uid, user=None, *args, **kwargs):
    provider = backend.name
    social = backend.strategy.storage.user.get_social_auth(provider, uid)

    if social:
        user = social.user

    return {"social": social, "user": user, "is_new": user is None, "new_association": social is None}


def associate_by_external_id(backend, details, user=None, *args, **kwargs):
    """
    Associate current auth with a user with the same ID in the DB.
    """

    external_user_id = details.get("user_id")

    if external_user_id:
        user = backend.strategy.storage.user.get_user(external_id=external_user_id)

        if user:
            return {"user": user, "is_new": False}

    return {"user": None, "is_new": False}


def update_external_id(backend, details, user=None, *args, **kwargs):
    if not user:
        return None

    if not user.last_login and details.get("email_verified"):
        user.is_active = True

    if backend.name == "okta-oauth2":
        user.source = constants.UserSource.OKTA
        user.external_id = details.get("user_id")
        backend.strategy.storage.user.changed(user)

    if backend.name == "auth0" and details["user_id"].startswith("auth0"):
        user.source = constants.UserSource.AUTH0
        user.external_id = details.get("user_id")
        backend.strategy.storage.user.changed(user)


def user_is_active(backend, user=None, *args, **kwargs):
    if not user.is_active:
        return _redirect_user_to_page(backend=backend, email=user.email, endpoint="revoked-access")


def update_user_full_name(strategy, details, user=None, *args, **kwargs):
    """Update user name only when user does not have assigned first and last name"""
    if not user:
        return

    first_name = details.get("first_name", "")
    last_name = details.get("last_name", "")
    if not (user.first_name and user.last_name) and (first_name and last_name):
        user.first_name = first_name
        user.last_name = last_name
        strategy.storage.user.changed(user)


def redirect_with_token(strategy, user=None, *args, **kwargs):
    uri = strategy.session_get("next", settings.DEFAULT_WEBAPP_HOST)

    if not uri.endswith("/"):
        uri = "{}/".format(uri)
    token = generate_signed_exchange_token(user)

    return shortcuts.redirect(
        parse.urljoin(uri, "auth/confirm/{uid}/{token}".format(uid=user.id, token=token))
    )


def user_exist_in_db(backend, details, user=None, *args, **kwargs):
    email = details.get("email")

    if backend.name == "okta-oauth2":
        backend.strategy.session["okta-oauth2-id-token"] = kwargs.get("response")["id_token"]

    if not models.User.objects.filter(email=email).exists():
        return _redirect_user_to_page(backend=backend, email=email, endpoint="not-registered")


def _redirect_user_to_page(backend, email, endpoint="not-registered"):
    uri = backend.strategy.session_get("next", settings.DEFAULT_WEBAPP_HOST)

    if not uri.endswith("/"):
        uri = "{}/".format(uri)

    params = dict(state=email)

    if backend.name == "okta-oauth2":
        return_to = parse.urljoin(uri, f"auth/{endpoint}")
    else:
        return_to = parse.urljoin(uri, f"auth/{endpoint}") + f"?{parse.urlencode(params)}"

    kwargs = {
        "okta-oauth2-id-token": backend.strategy.session_get("okta-oauth2-id-token", None),
        "email": email,
    }

    return shortcuts.redirect(
        backend_management.user_mgtm_backend.get_logout_url(return_to=return_to, **kwargs)
    )
