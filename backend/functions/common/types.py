import json
import dataclasses
import operator
import typing

from . import services


class LoaderMixin:
    @classmethod
    def from_json(cls, data: dict):
        field_names = set(f.name for f in dataclasses.fields(cls))
        return cls(**{k: v for k, v in data.items() if k in field_names})


class FetchMetaFileMixin:
    @classmethod
    def get_by_id(cls, id):
        data = services.get_dynamo_item(cls.table_name, id)
        return cls.from_json(json.loads(data))


@dataclasses.dataclass()
class Project(LoaderMixin, FetchMetaFileMixin):
    table_name: typing.ClassVar = "projects"
    id: int
    meta: dict = dataclasses.field(default_factory=dict)
    data_sources: list = dataclasses.field(default_factory=list)
    charts: list = dataclasses.field(default_factory=list)
    pages: list = dataclasses.field(default_factory=list)


@dataclasses.dataclass()
class Page(LoaderMixin, FetchMetaFileMixin):
    table_name: typing.ClassVar = "pages"
    id: int
    title: str = ""
    description: str = ""
    keywords: str = ""
    folder: str = ""
    updated: str = ""
    creator: str = ""
    blocks: list = dataclasses.field(default_factory=list)


@dataclasses.dataclass()
class DataSource(LoaderMixin, FetchMetaFileMixin):
    table_name: typing.ClassVar = "datasources"
    id: int
    meta: dict = dataclasses.field(default_factory=dict)
    file: str = ""
    result: str = ""
    shape: list = dataclasses.field(default_factory=list)
    fields: dict = dataclasses.field(default_factory=dict)
    filters: list = dataclasses.field(default_factory=list)
    views: list = dataclasses.field(default_factory=list)
    tags: list = dataclasses.field(default_factory=list)

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

    @property
    def source_file(self):
        return services.get_s3_object(self.source_file_path, version=self.source_file_version)
