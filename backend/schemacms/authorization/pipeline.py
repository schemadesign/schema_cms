from urllib import parse
from django import shortcuts
from django.conf import settings

from schemacms.users import constants


def associate_by_external_id(backend, details, user=None, *args, **kwargs):
    """
    Associate current auth with a user with the same ID in the DB.
    """
    if user:
        return None

    external_user_id = details.get('user_id')
    if external_user_id:
        user = list(backend.strategy.storage.user.get_user(external_id=external_user_id))
        if user:
            return {'user': user, 'is_new': False}


def update_external_id(backend, details, user=None, *args, **kwargs):
    if not user:
        return None

    if user.source != constants.UserSource.UNDEFINED:
        return None

    if backend.name == 'auth0':
        user.source = constants.UserSource.AUTH0
        user.external_id = details.get('user_id')
        backend.strategy.storage.user.changed(user)


def redirect_with_token(strategy, user=None, *args, **kwargs):
    uri = strategy.session_get('next', settings.DEFAULT_WEBAPP_HOST)
    if not uri.endswith('/'):
        uri = '{}/'.format(uri)
    token = user.get_exchange_token()
    return shortcuts.redirect(parse.urljoin(uri, "auth/confirm/{uid}/{token}".format(uid=user.id, token=token)))
