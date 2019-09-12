def file_upload_path(instance, filename):
    return instance.relative_path_to_save(filename)
