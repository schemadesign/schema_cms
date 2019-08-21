from urllib import parse
from django import shortcuts


def redirect_with_token(strategy, user=None, *args, **kwargs):
    uri = strategy.session_get('next', '/')
    if not uri.endswith('/'):
        uri = '{}/'.format(uri)
    token = user.get_exchange_token()
    return shortcuts.redirect(parse.urljoin(uri, "{uid}/{token}".format(uid=user.id, token=token)))
