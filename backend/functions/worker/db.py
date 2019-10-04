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
    db_data = services.secrets_manager.get_secret_value(SecretId=settings.DB_SECRET_ARN)
    return dict(
        database=db_data["dbname"],
        user=db_data["username"],
        password=db_data["password"],
        host=db_data["host"],
        port=db_data["port"],
    )


def initialize():
    runtime_db = PostgresqlDatabase(**get_db_settings())
    db.initialize(runtime_db)
