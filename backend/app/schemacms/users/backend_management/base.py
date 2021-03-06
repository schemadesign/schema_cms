from django.utils import crypto

from .. import models


class BaseUserManagement:
    """Abstract user management class to reset password, update user data
    in 3rd party services like auth0, aws cognito etc."""

    def create_user(self, user: models.User):
        raise NotImplementedError

    def delete_user(self, user) -> bool:
        raise NotImplementedError

    def password_change_url(self, user: models.User) -> str:
        raise NotImplementedError

    def get_user_source(self):
        """get_user_source should return one of constants.UserSource constants"""
        raise NotImplementedError

    def get_login_url(self) -> str:
        raise NotImplementedError

    def get_logout_url(self, return_to=None) -> str:
        raise NotImplementedError

    @classmethod
    def _generate_password(cls):
        return "".join(
            [
                crypto.get_random_string(length=4, allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ"),
                crypto.get_random_string(length=4, allowed_chars="23456789"),
                crypto.get_random_string(length=4, allowed_chars="!@#$%^&*"),
                crypto.get_random_string(length=4),
            ]
        )
