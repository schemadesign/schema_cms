import datetime
import json
import os
from distutils.util import strtobool
from os.path import join

import sentry_sdk
from configurations import Configuration
from sentry_sdk.integrations.django import DjangoIntegration

from schemacms.utils import json as json_

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

db_connection = os.environ.get("DB_CONNECTION", "{}")
# contains host, username, password and port
db_connection_config = json.loads(db_connection)


json.JSONEncoder.default = json_.CustomJSONEncoder.default


class Common(Configuration):
    BASE_DIR = base_dir

    if os.getenv("SENTRY_DNS"):
        sentry_sdk.init(dsn=os.getenv("SENTRY_DNS"), integrations=[DjangoIntegration()])

    INSTALLED_APPS = [
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        # Third party apps
        "rest_framework",  # utilities for rest apis
        "rest_framework.authtoken",  # token authentication
        "django_filters",  # for filtering rest endpoints
        "social_django",  # authorization by auth0
        "django_extensions",  # Django extensions
        "corsheaders",  # cors
        "softdelete",
        # Your apps
        "schemacms.authorization",
        "schemacms.users",
        "schemacms.projects",
        "schemacms.tags",
        "schemacms.datasources",
        "schemacms.states",
        "schemacms.pages",
        "schemacms.public_api",
    ]

    # https://docs.djangoproject.com/en/2.0/topics/http/middleware/
    MIDDLEWARE = [
        "django.middleware.security.SecurityMiddleware",
        "corsheaders.middleware.CorsMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "schemacms.config.middlewares.SocialAuthExceptionMiddleware",
    ]

    ALLOWED_HOSTS = ["*"]
    DEFAULT_HOST = os.getenv("DJANGO_HOST", "http://localhost:8000")  # without trailing slash
    DEFAULT_WEBAPP_HOST = os.getenv("DJANGO_WEBAPP_HOST", "http://localhost:3000")  # without trailing slash
    ROOT_URLCONF = "schemacms.urls"
    SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
    WSGI_APPLICATION = "schemacms.wsgi.application"

    # CORS
    CORS_ORIGIN_ALLOW_ALL = True
    X_FRAME_OPTIONS = "ALLOW-FROM *"

    # Email
    EMAIL_BACKEND = "anymail.backends.amazon_ses.EmailBackend"
    ANYMAIL = {"AMAZON_SES_CLIENT_PARAMS": {"endpoint_url": os.getenv("SES_ENDPOINT_URL")}}

    DEFAULT_FROM_EMAIL = os.getenv("DJANGO_DEFAULT_FROM_EMAIL", "info@local")
    SERVER_EMAIL = os.getenv("DJANGO_SERVER_EMAIL", "info@local")

    ADMINS = (("Author", "khanek@apptension.com"),)

    # Postgres
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB"),
            "USER": db_connection_config.get("username"),
            "PASSWORD": db_connection_config.get("password"),
            "HOST": db_connection_config.get("host"),
            # Persistent connections avoid the overhead of re-establishing a connection
            # to the database in each request
            "CONN_MAX_AGE": int(os.getenv("POSTGRES_CONN_MAX_AGE", "60")),
            "PORT": db_connection_config.get("port"),
        }
    }

    # General
    APPEND_SLASH = False
    TIME_ZONE = "UTC"
    LANGUAGE_CODE = "en-us"
    # If you set this to False, Django will make some optimizations so as not
    # to load the internationalization machinery.
    USE_I18N = False
    USE_L10N = True
    USE_TZ = True
    LOGIN_REDIRECT_URL = "/"

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/2.0/howto/static-files/
    STATIC_ROOT = os.path.normpath(join(os.path.dirname(BASE_DIR), "static"))
    STATICFILES_DIRS = []
    STATIC_URL = "/static/"
    STATICFILES_FINDERS = (
        "django.contrib.staticfiles.finders.FileSystemFinder",
        "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    )
    STORAGE_DIR = os.getenv("DJANGO_STORAGE_DIR", "/storage")
    IMAGE_ALLOWED_EXT = [".png", ".jpg", ".jpeg", ".gif"]

    DEFAULT_FILE_STORAGE = os.getenv(
        "DJANGO_DEFAULT_FILE_STORAGE", "storages.backends.s3boto3.S3Boto3Storage"
    )

    # Media files
    MEDIA_ROOT = join(os.path.dirname(BASE_DIR), "/")
    MEDIA_URL = "/"

    SCRIPTS_DIRECTORY = os.getenv("DJANGO_SCRIPTS_DIRECTORY", "step-scripts")

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": STATICFILES_DIRS + [os.path.join(BASE_DIR, "templates")],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                ]
            },
        }
    ]

    # Set DEBUG to False as a default for safety
    # https://docs.djangoproject.com/en/dev/ref/settings/#debug
    DEBUG = strtobool(os.getenv("DJANGO_DEBUG", "no"))

    # Password Validation
    # https://docs.djangoproject.com/en/2.0/topics/auth/passwords/#module-django.contrib.auth.password_validation
    AUTH_PASSWORD_VALIDATORS = [
        {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
        {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
        {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
        {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
    ]

    # Logging
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "django.server": {
                "()": "django.utils.log.ServerFormatter",
                "format": "[%(server_time)s] %(message)s",
            },
            "verbose": {"format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"},
            "simple": {"format": "%(levelname)s %(message)s"},
        },
        "filters": {"require_debug_true": {"()": "django.utils.log.RequireDebugTrue"}},
        "handlers": {
            "django.server": {
                "level": "INFO",
                "class": "logging.StreamHandler",
                "formatter": "django.server",
            },
            "console": {"level": "DEBUG", "class": "logging.StreamHandler", "formatter": "simple"},
            "mail_admins": {"level": "ERROR", "class": "django.utils.log.AdminEmailHandler"},
        },
        "loggers": {
            "django": {"handlers": ["console"], "propagate": True},
            "django.server": {"handlers": ["django.server"], "level": "INFO", "propagate": False},
            "django.request": {"handlers": ["mail_admins", "console"], "level": "ERROR", "propagate": False},
            "django.db.backends": {"handlers": ["console"], "level": "INFO"},
        },
    }

    # Custom user app
    AUTH_USER_MODEL = "users.User"

    # Django Rest Framework
    REST_FRAMEWORK = {
        "DEFAULT_PAGINATION_CLASS": "schemacms.utils.pagination.StandardResultsSetPagination",
        "PAGE_SIZE": int(os.getenv("DJANGO_PAGINATION_LIMIT", 50)),
        "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%S%z",
        "DEFAULT_RENDERER_CLASSES": (
            "rest_framework.renderers.JSONRenderer",
            "rest_framework.renderers.BrowsableAPIRenderer",
        ),
        "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
        "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
        "DEFAULT_AUTHENTICATION_CLASSES": (
            "schemacms.utils.authentication.RoleJSONWebTokenAuthentication",
            "rest_framework.authentication.SessionAuthentication",
            "rest_framework.authentication.TokenAuthentication",
        ),
        "EXCEPTION_HANDLER": "schemacms.utils.error.custom_exception_handler",
    }

    # Authentication
    AUTHENTICATION_BACKENDS = {
        "social_core.backends.auth0.Auth0OAuth2",
        "schemacms.users.backend_management.okta.ExtendedOktaOAuth2",
        "django.contrib.auth.backends.ModelBackend",
    }

    # JWT
    JWT_AUTH = {
        "JWT_AUTH_HEADER_PREFIX": "JWT",
        "JWT_EXPIRATION_DELTA": datetime.timedelta(days=30),
        "JWT_PAYLOAD_HANDLER": "schemacms.authorization.jwt.payload_handler",
    }

    # social-django

    SOCIAL_AUTH_PIPELINE = (
        "social_core.pipeline.social_auth.social_details",
        "social_core.pipeline.social_auth.social_uid",
        "schemacms.authorization.pipeline.user_exist_in_db",
        "social_core.pipeline.social_auth.auth_allowed",
        "schemacms.authorization.pipeline.social_user",
        "social_core.pipeline.user.get_username",
        "schemacms.authorization.pipeline.associate_by_external_id",
        "social_core.pipeline.social_auth.associate_by_email",
        "social_core.pipeline.user.create_user",
        "social_core.pipeline.social_auth.associate_user",
        "social_core.pipeline.social_auth.load_extra_data",
        "social_core.pipeline.user.user_details",
        "schemacms.authorization.pipeline.update_user_full_name",
        "schemacms.authorization.pipeline.update_external_id",
        "schemacms.authorization.pipeline.user_is_active",
        "schemacms.authorization.pipeline.redirect_with_token",
    )

    # User management
    USER_MGMT_BACKEND = os.getenv(
        "DJANGO_USER_MGMT_BACKEND", "schemacms.users.backend_management.auth0.Auth0UserManagement"
    )

    # social-django
    SOCIAL_AUTH_SANITIZE_REDIRECTS = False
    SOCIAL_AUTH_TRAILING_SLASH = False  # Remove trailing slash from routes
    SOCIAL_AUTH_PROTECTED_USER_FIELDS = ["first_name", "last_name"]

    SOCIAL_AUTH_AUTH0_DOMAIN = os.getenv("DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN")
    SOCIAL_AUTH_AUTH0_KEY = os.getenv("DJANGO_SOCIAL_AUTH_AUTH0_KEY")
    SOCIAL_AUTH_AUTH0_SECRET = os.getenv("DJANGO_SOCIAL_AUTH_AUTH0_SECRET")

    USER_MGMT_AUTH0_DOMAIN = os.getenv("DJANGO_USER_MGMT_AUTH0_DOMAIN")
    USER_MGMT_AUTH0_KEY = os.getenv("DJANGO_USER_MGMT_AUTH0_KEY")
    USER_MGMT_AUTH0_SECRET = os.getenv("DJANGO_USER_MGMT_AUTH0_SECRET")

    SOCIAL_AUTH_AUTH0_SCOPE = ["openid", "profile", "email"]

    OKTA_API_TOKEN = os.getenv("OKTA_API_TOKEN")
    OKTA_DOMAIN_URL = os.getenv("OKTA_DOMAIN_URL")

    SOCIAL_AUTH_OKTA_OAUTH2_KEY = os.getenv("SOCIAL_AUTH_OKTA_OAUTH2_KEY")
    SOCIAL_AUTH_OKTA_OAUTH2_SECRET = os.getenv("SOCIAL_AUTH_OKTA_OAUTH2_SECRET")
    SOCIAL_AUTH_OKTA_OAUTH2_API_URL = f"{OKTA_DOMAIN_URL}/oauth2"

    LOCAL_LAMBDA = False

    AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL", None)
    AWS_S3_ENDPOINT_URL = AWS_ENDPOINT_URL

    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_S3_OBJECT_PARAMETERS = {"ACL": "public-read"}
    AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
    AWS_STORAGE_PAGES_BUCKET_NAME = os.getenv("AWS_STORAGE_PAGES_BUCKET_NAME")
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False

    BASE_QUEUE_LIMIT = 52428800  # bytes, 50MB
    EXT_QUEUE_LIMIT = 241172480  # bytes, 230MB

    SQS_WORKER_QUEUE_URL = os.getenv("SQS_WORKER_QUEUE_URL", "http://localstack:4566/queue/schemacms-queue")
    SQS_WORKER_EXT_QUEUE_URL = os.getenv(
        "SQS_WORKER_EXT_QUEUE_URL", "http://localstack:4566/queue/schemacms-queue"
    )
    SQS_WORKER_MAX_QUEUE_URL = os.getenv(
        "SQS_WORKER_MAX_QUEUE_URL", "http://localstack:4566/queue/schemacms-queue"
    )

    # Allow lambda function to call API endpoint
    LAMBDA_AUTH_TOKEN = os.getenv("LAMBDA_AUTH_TOKEN")
    PROTECT_PUBLIC_API = os.getenv("PROTECT_PUBLIC_API", default=False)
    PUBLIC_API_AUTH_TOKEN = os.getenv("PUBLIC_API_AUTH_TOKEN")
    PUBLIC_API_URL = os.getenv("PUBLIC_API_URL", "http://localhost:8000/public-api/")
