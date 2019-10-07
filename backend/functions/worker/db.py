from peewee import *

import settings
import services

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


class JobStep(BaseModel):
    datasource_job = ForeignKeyField(Job, backref="steps")
    script = ForeignKeyField(Script, backref="steps")
    body = TextField()
    exec_order = IntegerField()

    class Meta:
        table_name = "projects_datasourcejobstep"


def get_db_settings():
    return dict(
        database=settings.DB_CONNECTION["dbname"],
        user=settings.DB_CONNECTION["username"],
        password=settings.DB_CONNECTION["password"],
        host=settings.DB_CONNECTION["host"],
        port=settings.DB_CONNECTION["port"],
        connect_timeout=settings.DB_CONNECTION.get("connect_timeout", 5)
    )


def initialize():
    runtime_db = PostgresqlDatabase(**get_db_settings())
    db.initialize(runtime_db)
