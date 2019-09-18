import datetime
import json
import os
from distutils.util import strtobool
from os.path import join

import boto3
import sentry_sdk
from configurations import Configuration
from sentry_sdk.integrations.django import DjangoIntegration

from schemacms.utils import json as json_

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

secrets_manager = boto3.client(
    "secretsmanager", endpoint_url=os.environ.get("SECRET_MANAGER_ENDPOINT_URL", None)
)

db_secret_arn = os.environ["DB_SECRET_ARN"]

db_secret_value = secrets_manager.get_secret_value(SecretId=db_secret_arn)
# contains host, username, password and port
db_connection_config = json.loads(db_secret_value.get("SecretString"))


json.JSONEncoder.default = json_.CustomJSONEncoder.default


class Common(Configuration):
    BASE_DIR = base_dir

    if os.getenv("SENTRY_DNS"):
        sentry_sdk.init(dsn=os.getenv("SENTRY_DNS"), integrations=[DjangoIntegration()])

    INSTALLED_APPS = (
        "whitenoise.runserver_nostatic",
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
        # Your apps
        "schemacms.users",
        "schemacms.authorization",
        "schemacms.projects",
    )

    # https://docs.djangoproject.com/en/2.0/topics/http/middleware/
    MIDDLEWARE = (
        "django.middleware.security.SecurityMiddleware",
        "corsheaders.middleware.CorsMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "schemacms.config.middlewares.SocialAuthExceptionMiddleware",
    )

    ALLOWED_HOSTS = ["*"]
    DEFAULT_HOST = os.getenv("DJANGO_HOST", "http://localhost:8000")  # without trailing slash
    DEFAULT_WEBAPP_HOST = os.getenv("DJANGO_WEBAPP_HOST", "http://localhost:3000")  # without trailing slash
    ROOT_URLCONF = "schemacms.urls"
    SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
    WSGI_APPLICATION = "schemacms.wsgi.application"

    # CORS
    CORS_ORIGIN_ALLOW_ALL = True

    # Email
    EMAIL_BACKEND = "anymail.backends.mandrill.EmailBackend"
    ANYMAIL = {"MANDRILL_API_KEY": os.getenv("MANDRILL_KEY")}

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
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    STORAGE_DIR = os.getenv("DJANGO_STORAGE_DIR", "/storage")

    DEFAULT_FILE_STORAGE = os.getenv(
        "DJANGO_DEFAULT_FILE_STORAGE", "schemacms.utils.storages.OverwriteStorage"
    )

    # Media files
    MEDIA_ROOT = join(os.path.dirname(BASE_DIR), "/")
    MEDIA_URL = "/"

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": STATICFILES_DIRS,
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
        "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
        "PAGE_SIZE": int(os.getenv("DJANGO_PAGINATION_LIMIT", 10)),
        "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%S%z",
        "DEFAULT_RENDERER_CLASSES": (
            "rest_framework.renderers.JSONRenderer",
            "rest_framework.renderers.BrowsableAPIRenderer",
        ),
        "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
        "DEFAULT_AUTHENTICATION_CLASSES": (
            "rest_framework_jwt.authentication.JSONWebTokenAuthentication",
            "rest_framework.authentication.SessionAuthentication",
            "rest_framework.authentication.TokenAuthentication",
        ),
    }

    # Authentication
    AUTHENTICATION_BACKENDS = {
        "social_core.backends.auth0.Auth0OAuth2",
        "django.contrib.auth.backends.ModelBackend",
    }

    # JWT
    JWT_AUTH = {"JWT_AUTH_HEADER_PREFIX": "JWT", "JWT_EXPIRATION_DELTA": datetime.timedelta(days=30)}

    # social-django
    SOCIAL_AUTH_PIPELINE = (
        # Get the information we can about the user and return it in a simple
        # format to create the user instance later. On some cases the details are
        # already part of the auth response from the provider, but sometimes this
        # could hit a provider API.
        "social_core.pipeline.social_auth.social_details",
        # Get the social uid from whichever service we're authing thru. The uid is
        # the unique identifier of the given user in the provider.
        "social_core.pipeline.social_auth.social_uid",
        # Verifies that the current auth process is valid within the current
        # project, this is where emails and domains whitelists are applied (if
        # defined).
        "social_core.pipeline.social_auth.auth_allowed",
        # Checks if the current social-account is already associated in the site.
        "social_core.pipeline.social_auth.social_user",
        # Make up a username for this person, appends a random string at the end if
        # there's any collision.
        "social_core.pipeline.user.get_username",
        # Send a validation email to the user to verify its email address.
        # Disabled by default.
        # 'social_core.pipeline.mail.mail_validation',
        # Try to fetch user by authorization service external user ID
        "schemacms.authorization.pipeline.associate_by_external_id",
        # Associates the current social details with another user account with
        # a similar email address. Disabled by default.
        "social_core.pipeline.social_auth.associate_by_email",
        # Create a user account if we haven't found one yet.
        "social_core.pipeline.user.create_user",
        # Create the record that associates the social account with the user.
        "social_core.pipeline.social_auth.associate_user",
        # Populate the extra_data field in the social record with the values
        # specified by settings (and the default ones like access_token, etc).
        "social_core.pipeline.social_auth.load_extra_data",
        # Update the user record with any changed info from the auth service.
        "social_core.pipeline.user.user_details",
        # Update the user first and last name
        "schemacms.authorization.pipeline.update_user_full_name",
        # Update user source and external ID from external authorization service
        "schemacms.authorization.pipeline.update_external_id",
        # Redirect user and add exchange token to query string
        "schemacms.authorization.pipeline.redirect_with_token",
    )

    # social-django
    SOCIAL_AUTH_SANITIZE_REDIRECTS = False
    SOCIAL_AUTH_TRAILING_SLASH = False  # Remove trailing slash from routes
    SOCIAL_AUTH_AUTH0_DOMAIN = os.getenv("DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN")
    SOCIAL_AUTH_AUTH0_KEY = os.getenv("DJANGO_SOCIAL_AUTH_AUTH0_KEY")
    SOCIAL_AUTH_AUTH0_SECRET = os.getenv("DJANGO_SOCIAL_AUTH_AUTH0_SECRET")
    SOCIAL_AUTH_AUTH0_SCOPE = ["openid", "profile", "email"]
    SOCIAL_AUTH_PROTECTED_USER_FIELDS = ["first_name", "last_name"]

    # User management
    USER_MGMT_BACKEND = os.getenv(
        "DJANGO_USER_MGMT_BACKEND", "schemacms.users.backend_management.auth0.Auth0UserManagement"
    )
    USER_MGMT_AUTH0_DOMAIN = os.getenv("DJANGO_USER_MGMT_AUTH0_DOMAIN")
    USER_MGMT_AUTH0_KEY = os.getenv("DJANGO_USER_MGMT_AUTH0_KEY")
    USER_MGMT_AUTH0_SECRET = os.getenv("DJANGO_USER_MGMT_AUTH0_SECRET")

    AWS_S3_ENDPOINT_URL = os.getenv("AWS_S3_ENDPOINT_URL")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

    SCRIPTS_S3_BUCKET = 'scripts'
    SCRIPTS_DS_UPLOAD_PATH = '/datasource/{}/'

    AWS_SQS_ENDPOINT_URL = os.getenv("SQS_ENDPOINT_URL")
