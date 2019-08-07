import flask

import flask_login
from . import blueprints
from . import constants
from . import decorators
from . import helpers
from . import models
from gist import database
from gist.user import models as user_models


def get_provider(name):
    return getattr(flask.current_app.extensions['authlib.flask.client'], name)


def create_user_if_needed(provider, uid, extra_data, **user_data):
    auth = database.db.session.query(models.UserAuth).filter_by(provider=provider, uid=uid).first()
    if not auth:
        user = user_models.User(**user_data)
        user.save(commit=False)
        auth = models.UserAuth(provider=provider, uid=uid, user=user, extra_data=extra_data)
        auth.save(commit=False)
        database.db.session.commit()
    return auth


@blueprints.default_blueprint.route('/callback/<provider_name>')
def callback(provider_name):
    # Handles response from token endpoint
    provider = get_provider(constants.AUTH0_NAME)
    provider.authorize_access_token()
    resp = provider.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    flask.session['jwt_payload'] = userinfo
    flask.session['profile'] = {
        'user_id': userinfo['sub'],
        'name': userinfo['name'],
        'provider': provider_name
    }
    auth = create_user_if_needed(
        provider=provider_name,
        uid=userinfo['sub'],
        extra_data=userinfo,
        email=userinfo.get('email'),
    )
    flask_login.login_user(auth.user)
    return flask.redirect('/dashboard')


@blueprints.default_blueprint.route('/login/<provider_name>')
def login(provider_name):
    provider = get_provider(provider_name)
    helper = helpers.get_helper(provider_name)(flask.current_app)
    return provider.authorize_redirect(
        redirect_uri=flask.url_for('auth.callback', provider_name=provider_name, _external=True),
        **helper.authorize_redirect_extra_kwargs()
    )


@blueprints.default_blueprint.route('/logout')
def logout():
    try:
        provider_name = flask.session['profile']['provider']
    except KeyError:
        redirect_url = '/'
    else:
        helper = helpers.get_helper(provider_name)
        redirect_url = helper(flask.current_app).logout_url()
    # Clear session stored data
    flask.session.clear()
    return flask.redirect(redirect_url)


@blueprints.default_blueprint.route('/token')
@decorators.requires_auth
def token():
    return flask_login.current_user.create_tokens()
