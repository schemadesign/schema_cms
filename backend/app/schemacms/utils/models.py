def file_upload_path(instance, filename):
    return instance.relative_path_to_save(filename)


class MetaGeneratorMixin:
    """Mixin adding functions to create meta.json file for object"""

    def meta_file_serialization(self):
        raise NotImplementedError
