import dataclasses
import operator
import typing

from . import services


class LoaderMixin:
    @classmethod
    def from_json(cls, data: dict):
        field_names = set(f.name for f in dataclasses.fields(cls))
        return cls(**{k: v for k, v in data.items() if k in field_names})


@dataclasses.dataclass()
class DataSource(LoaderMixin):
    table_name: typing.ClassVar = "datasources"
    id: int
    meta: dict = dataclasses.field(default_factory=dict)
    file: str = ""
    type: str = ""
    google_sheet: str = ""
    api_url: str = ""
    api_json_path: str = ""
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
            map(Step.from_json, data.get("steps", [])), key=operator.attrgetter("exec_order"),
        )
        job = super().from_json(data)
        for step in job.steps:
            step.job = job
        return job

    @property
    def source_file(self):
        if self.datasource.type == "file":
            return services.get_s3_object(self.source_file_path, version=self.source_file_version)
        if self.datasource.type == "google_sheet":
            return self.datasource.google_sheet
        if self.datasource.type == "api":
            return self.datasource.api_url
