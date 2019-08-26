from django.utils.module_loading import import_string
from django.conf import settings
from django.utils import functional


def get_user_management():
    return import_string(settings.USER_MGMT_BACKEND)()


user_mgtm_backend = functional.SimpleLazyObject(get_user_management)
