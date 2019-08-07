import flask

from . import constants


class BaseAuthHelper:
    def __init__(self, app):
        self.app = app

    def _get_config(self):
        return self.app.config['AUTH_SETTINGS']

    def register(self, oauth_app):
        raise NotImplementedError

    def get_config(self):
        raise NotImplementedError

    def callback_url(self):
        raise NotImplementedError

    def access_token_url(self):
        return

    def authorize_redirect_extra_kwargs(self):
        return dict()


class Auth0Helper(BaseAuthHelper):
    def get_config(self):
        return self._get_config()[constants.AUTH0_NAME]

    def register(self, oauth_app):
        config = self.get_config()
        domain = config["DOMAIN"]
        oauth_app.register(
            constants.AUTH0_NAME,
            client_id=config["CLIENT_ID"],
            client_secret=config["CLIENT_SECRET"],
            api_base_url=f'https://{domain}',
            access_token_url=f'https://{domain}/oauth/token',
            authorize_url=f'https://{domain}/authorize',
            client_kwargs={
                'scope': 'openid profile email',
            },
        )

    def logout_url(self):
        config = self.get_config()
        # Redirect user to logout endpoint
        params = {'returnTo': flask.url_for('home', _external=True), 'client_id': config['CLIENT_ID']}
        return flask.redirect(f"https://{config['DOMAIN']}/v2/logout?" + parse.urlencode(params))

    def authorize_redirect_extra_kwargs(self):
        domain = self.get_config()["DOMAIN"]
        return dict(audience=f'https://{domain}/userinfo')


def get_helper(provider_name):
    helpers = {
        constants.AUTH0_NAME: Auth0Helper
    }
    if provider_name not in helpers:
        expected = ','.join(helpers.keys())
        raise ValueError(f"Invalid provider. Got {provider_name}, expected one of {expected}.")
    return helpers[provider_name]
