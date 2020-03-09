from ..projects.models import Project
from ..datasources.models import DataSource


def update_public_api_meta(sender, instance, **kwargs):
    if isinstance(instance, (Project,)):
        if kwargs.get("update_fields") or kwargs.get("created"):
            instance.create_dynamo_item()

    elif isinstance(instance, (DataSource,)):
        if kwargs.get("update_fields") or kwargs.get("created"):
            instance.create_dynamo_item()
            instance.project.create_dynamo_item()

    else:
        raise ValueError("Unexpected instance")
