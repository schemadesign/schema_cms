import os
import socket
from .common import Common

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def show_toolbar(request):
    return True


class Local(Common):
    DEBUG = True

    # Mail
    EMAIL_HOST = "mailcatcher"
    EMAIL_PORT = 1025
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

    # django-debug-toolbar
    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[:-1] + '1' for ip in ips] + ['127.0.0.1', '10.0.2.2']
    Common.INSTALLED_APPS += ["debug_toolbar"]
    Common.MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

    DEBUG_TOOLBAR_PATCH_SETTINGS = False
    DEBUG_TOOLBAR_PANELS = ['debug_toolbar.panels.sql.SQLPanel', 'debug_toolbar.panels.timer.TimerPanel']
