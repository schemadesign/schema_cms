import typing

from rest_framework_jwt.settings import api_settings

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


class JWTAuthMethod:
    EMAIL = "email"
    GMAIL = "gmail"

    @classmethod
    def get_method_from_auth0(cls, auth0_id: str) -> typing.Union[str, None]:
        if auth0_id.startswith("auth0"):
            return cls.EMAIL
        elif auth0_id.startswith("google-oauth2"):
            return cls.GMAIL
        return None

    @classmethod
    def get_method_from_jwt_token(cls, token: str) -> typing.Union[str, None]:
        payload = jwt_decode_handler(token)
        return payload.get("auth_method")
