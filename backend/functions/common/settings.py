import os


LOCAL_AWS_SERVICES_HOST = os.getenv("LOCALSTACK_HOSTNAME", None)

AWS_S3_ENDPOINT_URL = os.getenv("AWS_S3_ENDPOINT_URL")
SECRET_MANAGER_ENDPOINT_URL = os.getenv("SECRET_MANAGER_ENDPOINT_URL")

if LOCAL_AWS_SERVICES_HOST:
    AWS_S3_ENDPOINT_URL = f"http://{LOCAL_AWS_SERVICES_HOST}:4572"
    SECRET_MANAGER_ENDPOINT_URL = f"http://{LOCAL_AWS_SERVICES_HOST}:4584"

AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_IMAGE_STORAGE_BUCKET_NAME = os.getenv("AWS_IMAGE_STORAGE_BUCKET_NAME")

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")

LAMBDA_AUTH_TOKEN = os.getenv("LAMBDA_AUTH_TOKEN", "")

BACKEND_URL = os.getenv("BACKEND_URL", "")

SENTRY_DNS = os.getenv("SENTRY_DNS", None)
