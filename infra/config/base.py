import json
from dataclasses import dataclass


DEFAULT_REGION = "us-west-2"


@dataclass
class DomainsEnvs:
    app: str
    public_api: str
    webapp: str


@dataclass
class EnvSettings:
    project_name: str
    env_stage: str
    project_env_name: str
    certificate_arn: str
    domains: DomainsEnvs
    lambdas_sizes: list
    arns: list
    data_base_name: str = "schemacms"


def load_infra_envs(config_file_path):
    with open(config_file_path) as config_file:
        config = json.load(config_file)
        config.pop("aws")

    env_stage = config.get("env_stage")
    env_settings = config.pop("env_config").get(env_stage)
    domains = DomainsEnvs(**env_settings.get("domains"))
    certificate = env_settings.get("certificate")
    lambdas_sizes = env_settings.get("lambdas_sizes")
    arns = env_settings.get("arns")
    project_env_name = f"{config.get('project_name')}-{env_stage}"

    return EnvSettings(
        project_env_name=project_env_name,
        domains=domains,
        certificate_arn=certificate,
        lambdas_sizes=lambdas_sizes,
        arns=arns,
        **config,
    )
