import logging
import os
from .common import Common

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Test(Common):
    logging.disable(logging.CRITICAL)

    # Turn debug off so tests run faster
    DEBUG = False
    TEMPLATE_DEBUG = False

    MEDIA_URL = "data"
    Common.TEMPLATES[0]["OPTIONS"]["debug"] = False
    MIDDLEWARE = Common.MIDDLEWARE
    DEFAULT_FILE_STORAGE = "schemacms.utils.storages.OverwriteStorage"

    # Mail
    EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

    # Turn off cache
    CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}

    # Use fast password hasher so tests run faster
    PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

    USER_MGMT_AUTH0_DOMAIN = "http://localhost"

    AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME", "schemacms")
    AWS_STORAGE_PAGES_BUCKET_NAME = os.getenv("AWS_STORAGE_PAGES_BUCKET_NAME", "schemacms-pages")
