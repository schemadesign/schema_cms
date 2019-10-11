import json
import os
from services import secret_manager


DB_PASSWORD = secret_manager.get_secret_value(os.getenv('DB_SECRET_ARN'))["SecretString"]

DB_CONNECTION = json.loads(os.getenv('DB_CONNECTION', '{}'))

AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_ENDPOINT_URL = os.getenv('AWS_S3_ENDPOINT_URL')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.getenv('AWS_DEFAULT_REGION')
