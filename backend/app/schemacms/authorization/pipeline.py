from urllib import parse
from django import shortcuts
from django.conf import settings

from schemacms.users import constants, models


def social_user(backend, uid, user=None, *args, **kwargs):
    provider = backend.name
    social = backend.strategy.storage.user.get_social_auth(provider, uid)
    if social:
        user = social.user
    return {'social': social,
            'user': user,
            'is_new': user is None,
            'new_association': social is None}


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

    if backend.name == "auth0":
        user.source = constants.UserSource.AUTH0
        user.external_id = details.get("user_id")
        backend.strategy.storage.user.changed(user)


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
    token = user.get_exchange_token()
    return shortcuts.redirect(
        parse.urljoin(uri, "auth/confirm/{uid}/{token}".format(uid=user.id, token=token))
    )


def user_exist_in_db(backend, details, user=None, *args, **kwargs):
    email = details.get("email")
    uri = backend.strategy.session_get("next", settings.DEFAULT_WEBAPP_HOST)

    if not uri.endswith("/"):
        uri = "{}/".format(uri)

    if not models.User.objects.filter(email=email).exists():
        return shortcuts.redirect(parse.urljoin(uri, "auth/not-registered"), email=email)
