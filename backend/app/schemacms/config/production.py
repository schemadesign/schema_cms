import os
from .common import Common


class Production(Common):
    INSTALLED_APPS = Common.INSTALLED_APPS
    SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

    ALLOWED_HOSTS = ["*"]
    INSTALLED_APPS += ("gunicorn", "storages", "s3file")

    MIDDLEWARE = Common.MIDDLEWARE
    MIDDLEWARE += ("s3file.middleware.S3FileMiddleware",)
    AWS_HEADERS = {"Cache-Control": "max-age=86400, s-maxage=86400, must-revalidate"}

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
