from .models import Block, Folder, DataSource, Page, Project


def update_meta_file(sender, instance, **kwargs):
    if isinstance(instance, (Project,)):
        instance.create_dynamo_item()

    elif isinstance(instance, (DataSource,)):
        instance.create_dynamo_item()
        instance.project.create_dynamo_item()

    elif isinstance(instance, (Page,)):
        instance.create_dynamo_item()
        project = instance.get_project()
        project.create_dynamo_item()

    elif isinstance(instance, (Block,)):
        instance.page.create_dynamo_item()

    elif isinstance(instance, (Folder,)):
        project = instance.get_project()
        for page in instance.pages.all():
            page.create_dynamo_item()
        project.create_dynamo_item()

    else:
        raise ValueError("Unexpected instance")
