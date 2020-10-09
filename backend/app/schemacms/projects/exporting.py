import io
import zipfile
import json

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
    breakpoint()
    zip_stream = io.BytesIO()
    zip_file = zipfile.ZipFile(zip_stream, "w")

    for cls, instances in object_tree.items():
        for field in cls._meta.get_fields():
            if isinstance(field, FileField):
                for instance in instances:
                    file_field = getattr(instance, field.name)
                    if file_field.name:
                        zip_file.writestr(f"files/{file_field.name}", file_field.read())

    keyorder = [
        "project",
        "blocktemplate",
        "blocktemplateelement",
        "tagcategory",
        "tag",
        "datasource",
        "datasourcemeta",
        "wranglingscript",
        "datasourcejob",
        "datasourcejobmetadata",
        "datasourcejobstep",
        "datasourcetag",
        "datasourcedescription",
        "filter",
        "state",
        "statefilter",
        "statetag",
        "section",
        "page",
        "pageblock",
        "pageblockelement",
        "pagetag",
    ]

    flatten = [
        instance
        for cls, instances in object_tree.items()
        for instance in instances
        if instance.deleted_at is None
    ]
    sorted_flatten = sorted(flatten, key=lambda i: keyorder.index(i._meta.model_name))

    serialized = serializers.serialize(
        output_format, sorted_flatten, use_natural_foreign_keys=True, use_natural_primary_keys=True,
    )

    extra_data = {"project_title": root_project[0].title, "schema_cms_version": "1.0.0"}
    zip_file.writestr(f"objects.{output_format}", serialized)
    zip_file.writestr("extra_data.json", json.dumps(extra_data))
    zip_file.close()

    return zip_stream
