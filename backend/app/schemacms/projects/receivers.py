def update_meta_file(sender, instance, **kwargs):
    instance.create_meta_file()
