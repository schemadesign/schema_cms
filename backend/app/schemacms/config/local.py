import os
from .common import Common

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Local(Common):
    DEBUG = True

    # Mail
    EMAIL_HOST = "mailcatcher"
    EMAIL_PORT = 1025
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
