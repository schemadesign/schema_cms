import json
from dataclasses import dataclass


DEFAULT_REGION = "eu-west-1"


@dataclass
class DomainsEnvs:
    admin: str
    api: str


@dataclass
class HostedZoneEnvs:
    id: str
    name: str


@dataclass
class EnvSettings:
    project_name: str
    env_stage: str
    project_env_name: str
    certificate_arn: str
    hosted_zone: HostedZoneEnvs
    domains: DomainsEnvs


def load_infra_envs(config_file_path):
    with open(config_file_path) as config_file:
        config = json.load(config_file)
        config.pop("aws")

    env_stage = config.get("env_stage")
    env_settings = config.pop("env_config").get(env_stage)
    hosted_zone = HostedZoneEnvs(**env_settings.get("hosted_zone"))
    domains = DomainsEnvs(**env_settings.get("domains"))
    certificate = env_settings.get("certificate")

    project_env_name = f"{config.get('project_name')}-{env_stage}"

    return EnvSettings(
        project_env_name=project_env_name,
        hosted_zone=hosted_zone,
        domains=domains,
        certificate_arn=certificate,
        **config,
    )
