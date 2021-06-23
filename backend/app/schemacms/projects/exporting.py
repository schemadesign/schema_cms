import io
import zipfile
import json

from django.contrib.admin.utils import NestedObjects
from django.core import serializers
from django.conf import settings
from django.db.models import FileField, ImageField
from django.db.utils import DEFAULT_DB_ALIAS

from schemacms.projects import models
from schemacms.datasources.models import DataSourceJob
from schemacms.utils.services import s3


def export_project(pk, using=DEFAULT_DB_ALIAS, output_format="json"):
    root_project = models.Project.objects.filter(pk=pk)
    collector = NestedObjects(using=using)
    collector.collect(root_project)
    object_tree = collector.data

    zip_stream = io.BytesIO()
    zip_file = zipfile.ZipFile(zip_stream, "w")

    keyorder = [
        "project",
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
        "blocktemplate",
        "blocktemplateelement",
        "section",
        "page",
        "pageblock",
        "pageblockelement",
        "pagetag",
    ]

    flatten = {
        instance
        for cls, instances in object_tree.items()
        if cls._meta.model_name != "project_editors"
        for instance in instances
        if instance.deleted_at is None
    }

    non_active_jobs = get_non_active_jobs(flatten)
    non_active_jobs_steps = get_non_active_jobs_steps(flatten, non_active_jobs)
    non_active_jobs_metas = get_non_active_jobs_metas(flatten, non_active_jobs)
    custom_element_sets = get_custom_element_set(flatten)

    elements_to_remove = non_active_jobs | non_active_jobs_steps | non_active_jobs_metas | custom_element_sets
    flatten = flatten - elements_to_remove

    sorted_flatten = sorted(flatten, key=lambda i: keyorder.index(i._meta.model_name))

    for instance in sorted_flatten:
        for field in instance._meta.get_fields():
            if isinstance(field, (FileField, ImageField)):
                file_field = getattr(instance, field.name)
                if file_field.name:
                    zip_file.writestr(f"files/{file_field.name}", file_field.read())

        if isinstance(instance, DataSourceJob):
            if instance.source_file_path:
                try:
                    s3_response = s3.get_object(
                        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                        Key=instance.source_file_path,
                        VersionId=instance.source_file_version,
                    )
                except Exception:
                    continue

                if s3_response["ResponseMetadata"]["HTTPStatusCode"] == 200:
                    base_name = instance.source_file_path.split(".")[0]

                    zip_file.writestr(f"files/{base_name}_export_version.csv", s3_response["Body"].read())

    serialized = serializers.serialize(
        output_format, sorted_flatten, use_natural_foreign_keys=True, use_natural_primary_keys=True,
    )

    extra_data = {"project_title": root_project[0].title, "schema_cms_version": "1.0.0"}
    zip_file.writestr(f"objects.{output_format}", serialized)
    zip_file.writestr("extra_data.json", json.dumps(extra_data))
    zip_file.close()

    return zip_stream


def get_non_active_jobs(data):
    return set(filter(lambda x: x._meta.model_name == "datasourcejob" and x.is_active is False, data))


def get_non_active_jobs_steps(data, non_active_jobs):
    return set(
        filter(
            lambda x: x._meta.model_name == "datasourcejobstep" and x.datasource_job in non_active_jobs, data
        )
    )


def get_non_active_jobs_metas(data, non_active_jobs):
    return set(
        filter(lambda x: x._meta.model_name == "datasourcejobmetadata" and x.job in non_active_jobs, data)
    )


def get_custom_element_set(data):
    return set(filter(lambda x: x._meta.model_name == "customelementset", data))
