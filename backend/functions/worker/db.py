import json

from peewee import *

import settings
from services import secret_manager

db = Proxy()


class JobState:
    PENDING = "pending"
    PROCESSING = "processing"
    FAILED = "failed"
    SUCCESS = "success"


class BaseModel(Model):
    class Meta:
        database = db


class DataSource(BaseModel):
    file = CharField(max_length=255)

    class Meta:
        table_name = "projects_datasource"


class Script(BaseModel):
    name = CharField()

    class Meta:
        table_name = "projects_wranglingscript"


class Job(BaseModel):
    datasource = ForeignKeyField(DataSource, backref="jobs")
    result = CharField()
    error = TextField()
    job_state = CharField()

    class Meta:
        table_name = "projects_datasourcejob"

    @classmethod
    def get_by_id(cls, id):
        return (
            cls.select()
            .join(JobStep, join_type=JOIN.LEFT_OUTER)
            .switch(cls)
            .join(DataSource)
            .where((cls.id == id))
            .get()
        )


class JobStep(BaseModel):
    datasource_job = ForeignKeyField(Job, backref="steps")
    script = ForeignKeyField(Script, backref="steps")
    body = TextField()
    exec_order = IntegerField()

    class Meta:
        table_name = "projects_datasourcejobstep"


def get_db_settings():
    arn = secret_manager.get_secret_value(SecretId=settings.DB_SECRET_ARN)
    secret_data = json.loads(arn["SecretString"])

    return dict(
        database=secret_data["dbname"],
        user=secret_data["username"],
        password=secret_data["password"],
        host=secret_data["host"],
        port=secret_data["port"],
        connect_timeout=secret_data.get("connect_timeout", 5),
    )


def initialize():
    runtime_db = PostgresqlDatabase(**get_db_settings())
    db.initialize(runtime_db)
