import io
import zipfile

from django.contrib.admin.utils import NestedObjects
from django.core import serializers
from django.db.models import FileField
from django.db.utils import DEFAULT_DB_ALIAS

from schemacms.projects import models


def export_project(pk, using=DEFAULT_DB_ALIAS, output_format="json"):
    root_project = models.Project.objects.filter(pk=pk)
    collector = NestedObjects(using=using)
    collector.collect(root_project)
    object_tree = collector.data

    zip_stream = io.BytesIO()
    zip_file = zipfile.ZipFile(zip_stream, "w")

    for cls, instances in object_tree.items():
        for field in cls._meta.get_fields():
            if isinstance(field, FileField):
                for instance in instances:
                    file_field = getattr(instance, field.name)
                    if file_field.name:
                        zip_file.writestr(f"files/{file_field.name}", file_field.read())

    flatten = [instance for cls, instances in object_tree.items() for instance in instances]
    serialized = serializers.serialize(
        output_format,
        flatten,
        use_natural_foreign_keys=True,
        use_natural_primary_keys=True,
    )

    zip_file.writestr(f"objects.{output_format}", serialized)
    zip_file.close()

    return zip_stream
