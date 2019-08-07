import functools

import flask


def requires_auth(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if 'profile' not in flask.session:
            # Redirect to Login page here
            return flask.redirect('/')
        return f(*args, **kwargs)
    return decorated
