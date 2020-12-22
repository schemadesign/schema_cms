import os


AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL", None)

AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
IMAGE_SCRAPING_FETCH_TIMEOUT = int(os.getenv("IMAGE_SCRAPING_FETCH_TIMEOUT", 30))
AWS_IMAGE_STORAGE_BUCKET_NAME = os.getenv("AWS_IMAGE_STORAGE_BUCKET_NAME")
AWS_IMAGE_STATIC_URL = os.getenv("AWS_IMAGE_STATIC_URL")

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("AWS_DEFAULT_REGION")

LAMBDA_AUTH_TOKEN = os.getenv("LAMBDA_AUTH_TOKEN", "")

BACKEND_URL = os.getenv("BACKEND_URL", "")

SENTRY_DNS = os.getenv("SENTRY_DNS", None)
