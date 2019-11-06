import dataclasses
import json
import operator

import typing

from . import (
    services,
    settings,
)


@dataclasses.dataclass
class DataSource:
    id: int
    file: str

    @classmethod
    def from_json(cls, data):
        return cls(id=data["id"], file=data["file"])


@dataclasses.dataclass
class Step:
    id: int
    exec_order: int

    @classmethod
    def from_json(cls, data):
        return cls(id=data["id"], exec_order=data.get("exec_order", 0))


@dataclasses.dataclass
class Job:
    id: int
    datasource: DataSource
    steps: typing.List[Step]

    @classmethod
    def get_by_id(cls, id):
        meta_file = services.s3.get_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=f"{id}/meta.json"
        )
        data = json.loads(meta_file["Body"])
        return cls.from_json(data)

    @classmethod
    def from_json(cls, data):
        return cls(
            id=data["id"],
            datasource=DataSource.from_json(data["datasource"]),
            steps=sorted(
                map(Step.from_json, data.get("steps", [])),
                key=operator.attrgetter["exec_order"]
            ),
        )

    @property
    def result_file_name(self):
        return f"{self.datasource.id}/outputs/job_{self.id}_result.csv"
