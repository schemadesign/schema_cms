from django import shortcuts


def redirect_with_token(strategy, user=None, *args, **kwargs):
    uri = strategy.session_get('next', '/')
    token = user.get_exchange_token()
    return shortcuts.redirect("{uri}?uid={uid}&token={token}".format(uri=uri, uid=user.id, token=token))
