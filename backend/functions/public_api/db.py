import json

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


class DataSourceMeta(BaseModel):
    datasource = ForeignKeyField(DataSource, backref="meta_data")
    items = IntegerField()

    class Meta:
        table_name = "projects_datasourcemeta"


class Job(BaseModel):
    datasource = ForeignKeyField(DataSource, backref="jobs")
    result = CharField()
    error = TextField()
    job_state = CharField()

    class Meta:
        table_name = "projects_datasourcejob"


class DataSourceJobMetaData(BaseModel):
    job = ForeignKeyField(Job, backref="meta_data")
    items = IntegerField()

    class Meta:
        table_name = "projects_datasourcejobmetadata"


def get_db_settings():
    arn = secret_manager.get_secret_value(SecretId=settings.DB_SECRET_ARN)
    secret_data = json.loads(arn['SecretString'])

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
