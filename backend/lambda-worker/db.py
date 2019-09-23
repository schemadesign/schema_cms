from peewee import *

import settings

db = PostgresqlDatabase(
    database=settings.DB_NAME,
    user=settings.DB_USER,
    password=settings.DB_PASS,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
)


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
    outcome = TextField()
    job_state = CharField()

    class Meta:
        table_name = "projects_datasourcejob"


class JobStep(BaseModel):
    datasource_job = ForeignKeyField(Job, backref="steps")
    key = CharField()
    body = TextField()
    exec_order = IntegerField()

    class Meta:
        table_name = "projects_datasourcejobstep"
