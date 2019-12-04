def update_meta_file(sender, instance, **kwargs):
    if hasattr(instance, "get_project"):
        project = instance.get_project()
        project.create_meta_file()

    elif hasattr(instance, "project"):
        instance.create_meta_file()
        instance.project.create_meta_file()

    else:
        instance.create_meta_file()
