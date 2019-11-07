import json

from django.core.files import base
from django.core.files.storage import default_storage


class MetaGeneratorMixin:
    """Mixin adding functions to create meta.json file for object"""

    def meta_file_serialization(self):
        raise NotImplementedError

    def create_meta_file(self):
        serialized_data = self.meta_file_serialization()
        path = self.meta_file_path()
        default_storage.save(name=path, content=base.ContentFile(json.dumps(serialized_data).encode()))

    def meta_file_path(self):
        return f"{self.id}/meta.json"
