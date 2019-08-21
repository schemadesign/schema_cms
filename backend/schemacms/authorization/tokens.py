import six

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import functional


class ExchangeTokenGenerator(PasswordResetTokenGenerator):
    """ExchangeTokenGenerator generates token used to get jwt token only once. When user retrieve new jwt token
    then User.last_login will change and all old exchange tokens are invalid"""

    key_salt = "schemacms.authorization.tokens.ExchangeTokenGenerator"

    def _make_hash_value(self, user, timestamp):
        # Truncate microseconds so that tokens are consistent even if the
        # database doesn't support microseconds.
        login_timestamp = '' if user.last_login is None else user.last_login.replace(microsecond=0, tzinfo=None)
        return "".join((six.text_type(user.pk), six.text_type(timestamp), six.text_type(login_timestamp)))


exchange_token = functional.SimpleLazyObject(ExchangeTokenGenerator)
