from rest_framework_jwt import utils


def payload_handler(user, extra_data: dict = None) -> dict:
    ret = utils.jwt_payload_handler(user)
    if extra_data:
        ret.update(extra_data)
    return ret
