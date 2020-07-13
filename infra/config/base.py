import json
from dataclasses import dataclass


@dataclass
class EnvSettings:
    project_name: str
    lambdas_sizes: list
    data_base_name: str = "schemacms"


def load_infra_envs(config_file_path):
    with open(config_file_path) as config_file:
        config = json.load(config_file)
        config.pop("aws")

    return EnvSettings(**config)
