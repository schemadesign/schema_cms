import json
from dataclasses import dataclass


@dataclass
class EnvSettings:
    project_name: str
    lambdas_sizes: list
    sentry_dns_arn: str
    gh_token_arn: str
    data_base_name: str = "schemacms"


def load_infra_envs(config_file_path):
    with open(config_file_path) as config_file:
        config = json.load(config_file)
        config.pop("aws")

    return EnvSettings(**config)
