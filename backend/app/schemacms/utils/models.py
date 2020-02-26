from .services import dynamo


def file_upload_path(instance, filename):
    return instance.relative_path_to_save(filename)


class MetaGeneratorMixin:
    """Mixin adding functions to create meta.json file for object"""

    def meta_file_serialization(self):
        raise NotImplementedError

    def create_dynamo_item(self):
        table = dynamo.Table(self.dynamo_table_name)
        table.put_item(Item=self.meta_file_serialization())
