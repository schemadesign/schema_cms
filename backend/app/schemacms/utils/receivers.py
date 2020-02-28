from ..projects.models import Project
from ..datasources.models import DataSource


def update_public_api_meta(sender, instance, **kwargs):
    if isinstance(instance, (Project,)):
        instance.create_dynamo_item()

    elif isinstance(instance, (DataSource,)):
        instance.create_dynamo_item()
        instance.project.create_dynamo_item()

    else:
        raise ValueError("Unexpected instance")
