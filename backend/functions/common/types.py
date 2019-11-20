import dataclasses
import json
import operator
import typing

from . import settings, services


class LoaderMixin:
    @classmethod
    def from_json(cls, data: dict):
        field_names = set(f.name for f in dataclasses.fields(cls))
        return cls(**{k: v for k, v in data.items() if k in field_names})


class FetchMetaFileMixin:
    @classmethod
    def get_by_id(cls, id):
        response = services.s3.get_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=cls.get_meta_file_path(id)
        )
        data = json.load(response["Body"])
        return cls.from_json(data)

    @classmethod
    def get_meta_file_path(cls, id):
        return f"{id}/meta.json"


@dataclasses.dataclass()
class DataSource(LoaderMixin, FetchMetaFileMixin):
    id: int
    name: str = ""
    file: str = ""
    items: int = 0
    result: str = ""
    fields: list = dataclasses.field(default_factory=list)
    filters: list = dataclasses.field(default_factory=list)

    @property
    def result_parquet(self):
        return self.result.replace(".csv", ".parquet")


@dataclasses.dataclass()
class Script(LoaderMixin):
    id: int
    name: str


@dataclasses.dataclass()
class Step(LoaderMixin):
    id: int
    script: Script
    body: str
    exec_order: int = 0
    options: dict = dataclasses.field(default_factory=dict)
    job: "Job" = None

    @classmethod
    def from_json(cls, data: dict):
        data = data.copy()
        data["script"] = Script.from_json(data["script"])
        return super().from_json(data)


@dataclasses.dataclass()
class Job(LoaderMixin):
    id: int
    datasource: DataSource
    source_file_path: str = ""
    source_file_version: typing.Union[str, None] = None
    result: str = ""
    steps: typing.List[Step] = dataclasses.field(default_factory=list)

    @classmethod
    def from_json(cls, data: dict) -> "Job":
        data = data.copy()
        data["datasource"] = DataSource.from_json(data["datasource"])
        data["steps"] = sorted(
            map(Step.from_json, data.get("steps", [])), key=operator.attrgetter("exec_order")
        )
        job = super().from_json(data)
        for step in job.steps:
            step.job = job
        return job
