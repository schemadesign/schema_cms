from peewee import *

import settings
from services import secret_manager

db = Proxy()


class JobState:
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    FAILED = "failed"
    SUCCESS = "success"


class BaseModel(Model):
    class Meta:
        database = db


class DataSource(BaseModel):
    file = CharField()

    class Meta:
        table_name = "projects_datasource"


class Job(BaseModel):
    datasource = ForeignKeyField(DataSource, backref="jobs")
    result = CharField()
    error = TextField()
    job_state = CharField()

    class Meta:
        table_name = "projects_datasourcejob"


def get_db_settings():
    arn = secret_manager.get_secret_value(SecretId=settings.DB_SECRET_ARN)
    secret_data = arn['SecretString']

    return dict(
        database=settings.DB_CONNECTION["dbname"],
        user=settings.DB_CONNECTION["username"],
        password=secret_data["password"],
        host=settings.DB_CONNECTION["host"],
        port=settings.DB_CONNECTION["port"],
        connect_timeout=settings.DB_CONNECTION.get("connect_timeout", 5)
    )


def initialize():
    runtime_db = PostgresqlDatabase(**get_db_settings())
    db.initialize(runtime_db)
