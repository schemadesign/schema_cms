def update_meta_file(sender, instance, **kwargs):
    instance_name = instance.__class__.__name__

    if instance_name in ["Page", "Block", "Directory"]:
        project = instance.get_project()
        project.create_meta_file()
    else:
        instance.create_meta_file()
