import dataclasses
import json
import operator
import typing

from . import (
    settings,
    services,
)


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


@dataclasses.dataclass()
class Script(LoaderMixin):
    id: int
    name: str


@dataclasses.dataclass()
class Step(LoaderMixin):
    id: int
    script: Script
    body: str

    @classmethod
    def from_json(cls, data: dict):
        data["script"] = Script.from_json(data["script"])
        return super().from_json(data)


@dataclasses.dataclass()
class Job(LoaderMixin, FetchMetaFileMixin):
    id: int
    datasource: DataSource
    result: str
    steps: typing.List[Step]

    @classmethod
    def from_json(cls, data: dict):
        data["datasource"] = DataSource.from_json(data["datasource"])
        data["steps"] = sorted(
            map(Step.from_json, data.get("steps", [])),
            key=operator.itemgetter("exec_order")
        )
        return super().from_json(data)

    @classmethod
    def get_meta_file_path(cls, id):
        return f"{id}/meta.json"
