import json
import os

import django.core.files.base
from softdelete.models import SoftDeleteObject
from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.core.validators import FileExtensionValidator
from django.db import models, transaction
from django.utils import functional
from django_extensions.db.models import TimeStampedModel

from . import constants, managers, fsm
from ..utils import services
from ..utils.models import MetaGeneratorMixin, file_upload_path


class MetaDataModel(models.Model):
    items = models.PositiveIntegerField(null=True)
    fields = models.PositiveSmallIntegerField(null=True)
    preview = models.FileField(null=True, upload_to=file_upload_path)
    fields_names = pg_fields.ArrayField(models.TextField(), blank=True, default=list)
    fields_with_urls = pg_fields.ArrayField(models.TextField(), blank=True, default=list)

    class Meta:
        abstract = True

    @property
    def data(self):
        if not self.preview:
            return {}

        self.preview.seek(0)

        return json.loads(self.preview.read())

    @property
    def shape(self):
        return [self.items, self.fields]


class DataSource(MetaGeneratorMixin, SoftDeleteObject, TimeStampedModel):
    name = models.CharField(max_length=constants.DATASOURCE_NAME_MAX_LENGTH, null=True)
    type = models.CharField(max_length=25, choices=constants.DATA_SOURCE_TYPE_CHOICES)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="data_sources")
    file = models.FileField(
        null=True,
        upload_to=file_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=["csv", "tsv"])],
    )
    google_sheet = models.URLField(null=True, blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="data_sources", null=True
    )
    active_job = models.ForeignKey(
        "datasources.DataSourceJob",
        blank=True,
        on_delete=models.CASCADE,
        related_name="data_sources",
        null=True,
    )

    objects = managers.DataSourceManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name"],
                name="unique_project_datasource",
                condition=models.Q(deleted_at=None),
            )
        ]
        ordering = ("-modified",)

    def __str__(self):
        return self.name or str(self.id)

    def natural_key(self):
        return (self.name,) + self.project.natural_key()
    natural_key.dependencies = ['projects.project']

    def get_source_file(self):
        return self.file

    @property
    def formatted_meta(self):
        custom_data = (
            {d["key"]: d["value"] for d in self.description.data} if hasattr(self, "description") else {}
        )

        return {
            "id": self.id,
            "name": self.name,
            "created_by": self.created_by.get_full_name() if self.created_by else "",
            "created": self.created.strftime("%Y-%m-%d"),
            "updated": self.modified.strftime("%Y-%m-%d"),
            "custom_data": custom_data,
            "source_file": self.file.url if self.file else None,
            "result_file": self.active_job.result.url if self.active_job and self.active_job.result else None,
        }

    @property
    def meta_file_processing_type(self):
        return constants.WorkerProcessType.DATASOURCE_META_PROCESSING

    @property
    def available_scripts(self):
        return WranglingScript.objects.filter(
            models.Q(is_predefined=True) | models.Q(datasource=self)
        ).order_by("-is_predefined", "name")

    @property
    def jobs_history(self):
        return self.jobs.all().order_by("-created")

    @property
    def source_file_latest_version(self) -> str:
        return next(
            (
                v.id
                for v in self.file.storage.bucket.object_versions.filter(Prefix=self.file.name)
                if v.is_latest and v.id != "null"
            ),
            "",
        )

    @property
    def last_job(self):
        try:
            return self.jobs.latest("created")
        except DataSourceJob.DoesNotExist:
            return None

    @functional.cached_property
    def filters_count(self):
        return self.filters.count()

    @functional.cached_property
    def project_info(self):
        return dict(id=self.project.id, title=self.project.title)

    def schedule_update_meta(self, copy_steps):
        if not self.file and not self.google_sheet:
            raise ValueError("Cannot schedule meta processing without source")

        file_size = self.file.size if self.file else settings.EXT_QUEUE_LIMIT - 1

        with transaction.atomic():
            self.meta_data.status = constants.ProcessingState.PENDING
            self.meta_data.save(update_fields=["status"])

            transaction.on_commit(
                lambda: services.schedule_object_meta_processing(
                    obj=self, source_file_size=file_size, copy_steps=copy_steps
                )
            )

    def update_meta(self, **kwargs):
        if not self.file and not self.google_sheet:
            return

        with transaction.atomic():
            preview = kwargs.pop("preview", {})

            meta, _ = DataSourceMeta.objects.update_or_create(datasource_id=self.id, defaults=kwargs)
            if preview:
                file_name, _ = self.get_original_file_name(self.file.name)
                meta.preview.save(
                    f"{file_name}_preview.json",
                    django.core.files.base.ContentFile(content=json.dumps(preview).encode()),
                )

    def relative_path_to_save(self, filename):
        base_path = self.file.storage.location
        if not (self.id and self.project_id):
            raise ValueError("Project or DataSource ID is not set")
        return os.path.join(base_path, f"{self.id}/uploads/{filename}")

    def get_original_file_name(self, file_name=None):
        if not file_name:
            file_name = self.file.name
        name, ext = os.path.splitext(os.path.basename(file_name))
        return name, os.path.basename(file_name)

    def create_job(self, **job_kwargs):
        """Create new job for data source, copy source file and version"""
        return DataSourceJob.objects.create(
            datasource=self,
            source_file_path=self.file.name,
            source_file_version=self.source_file_latest_version,
            **job_kwargs,
        )

    def set_active_job(self, job):
        self.active_job = job
        self.save(update_fields=["active_job"])

    def result_fields_info(self):
        try:
            preview = self.active_job.meta_data.preview
            fields = json.loads(preview.read())["fields"]
        except (DataSourceJobMetaData.DoesNotExist, json.JSONDecodeError, KeyError, OSError):
            return []

        data = {
            str(num): {"name": key, "type": value["dtype"]} for num, (key, value) in enumerate(fields.items())
        }

        return data

    def add_tags(self, tags_list):
        self.tags.all().delete()

        for tag in tags_list:
            DataSourceTag.objects.create(datasource=self, category_id=tag["category"], value=tag["value"])

    def add_description(self, description):
        obj, _ = DataSourceDescription.objects.update_or_create(datasource=self, defaults=dict(**description))
        return obj

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "meta": {
                "name": self.name,
                "description": None,
                "source": None,
                "source-url": None,
                "methodology": None,
                "updated": self.modified.isoformat(),
                "creator": None if not self.created_by else self.created_by.get_full_name(),
            },
            "type": self.type,
            "file": self.file.name if self.file else None,
            "google_sheet": self.google_sheet,
            "shape": None,
            "result": None,
            "fields": {},
            "filters": [],
            "views": [],
            "tags": [],
        }

        if self.active_job:
            job_meta = getattr(self.active_job, "meta_data", None)
            data.update(
                {
                    "shape": job_meta.shape if job_meta else [],
                    "result": self.active_job.result.name or None,
                    "fields": self.result_fields_info(),
                }
            )
        if self.filters:
            filters = [f.meta_file_serialization() for f in self.filters.filter(is_active=True)]
            data.update({"filters": filters})

        return data


class DataSourceDescription(SoftDeleteObject):
    datasource = models.OneToOneField(DataSource, on_delete=models.CASCADE, related_name="description")
    data = pg_fields.ArrayField(pg_fields.JSONField(), default=list, blank=True)

    def __str__(self):
        return f"{self.id}"


class DataSourceMeta(SoftDeleteObject, MetaDataModel):
    datasource = models.OneToOneField(DataSource, on_delete=models.CASCADE, related_name="meta_data")
    status = models.CharField(
        max_length=25, choices=constants.PROCESSING_STATE_CHOICES, default=constants.ProcessingState.PENDING
    )
    error = models.TextField(blank=True, default="")

    objects = managers.DataSourceMetaManager()

    def __str__(self):
        return f"DataSource {self.datasource} meta"

    def natural_key(self):
        return self.datasource.natural_key()

    def relative_path_to_save(self, filename):
        base_path = self.preview.storage.location

        return os.path.join(base_path, f"{self.datasource.id}/previews/{filename}")


class WranglingScript(SoftDeleteObject, TimeStampedModel):
    datasource = models.ForeignKey(
        DataSource, on_delete=models.CASCADE, related_name="scripts", blank=True, null=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="scripts2", blank=True, null=True
    )
    name = models.CharField(max_length=constants.SCRIPT_NAME_MAX_LENGTH, blank=True)
    is_predefined = models.BooleanField(default=True)
    file = models.FileField(
        upload_to=file_upload_path, null=True, validators=[FileExtensionValidator(allowed_extensions=["py"])]
    )
    body = models.TextField(blank=True)
    last_file_modification = models.DateTimeField(null=True)
    specs = pg_fields.JSONField(default=dict, blank=True, editable=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.body:
            self.body = self.file.read().decode()
        super(WranglingScript, self).save(*args, **kwargs)

    def relative_path_to_save(self, filename):
        base_path = self.file.storage.location

        if self.is_predefined:
            return os.path.join(base_path, f"scripts/{filename}")
        else:
            return os.path.join(base_path, f"{self.datasource.id}/scripts/{filename}")

    def meta_file_serialization(self):
        data = {"id": self.id, "name": self.name}
        return data


class DataSourceJob(MetaGeneratorMixin, SoftDeleteObject, TimeStampedModel, fsm.DataSourceJobFSM):
    datasource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name="jobs")
    description = models.TextField(blank=True)
    source_file_path = models.CharField(max_length=255, editable=False)
    source_file_version = models.CharField(max_length=36, editable=False)
    result = models.FileField(upload_to=file_upload_path, null=True, blank=True)
    error = models.TextField(blank=True, default="")

    objects = managers.DataSourceJobManager()

    def __str__(self):
        return f"DataSource Job #{self.pk}"

    def natural_key(self):
        return (self.source_file_path, self.source_file_version) + self.datasource.natural_key()
    natural_key.dependencies = ['datasources.datasource']

    @property
    def get_source_file(self):
        if not self.source_file_path:
            return
        params = {"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": self.source_file_path}
        if self.source_file_version:
            params["VersionId"] = self.source_file_version
        return django.core.files.base.File(services.s3.get_object(**params)["Body"])

    @property
    def source_file_url(self):
        if not self.source_file_path:
            return ""

        filename = os.path.basename(self.source_file_path)
        params = {
            "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
            "Key": self.source_file_path,
            "ResponseContentDisposition": f"attachment; filename={filename}",
        }
        if self.source_file_version:
            params["VersionId"] = self.source_file_version

        return services.s3.generate_presigned_url(ClientMethod="get_object", Params=params)

    @functional.cached_property
    def project_info(self):
        project = self.datasource.project
        return dict(id=project.id, title=project.title)

    def relative_path_to_save(self, filename):
        base_path = self.result.storage.location
        if self.id is None or self.datasource_id is None:
            raise ValueError("Job or DataSource ID is not set")
        return os.path.join(base_path, f"{self.datasource_id}/jobs/{self.id}/outputs/{filename}")

    def update_meta(self, preview: dict, items: int, fields: int, fields_names: list, fields_with_urls: list):
        with transaction.atomic():
            meta, _ = DataSourceJobMetaData.objects.update_or_create(
                job=self,
                defaults={
                    "fields": fields,
                    "items": items,
                    "fields_names": fields_names,
                    "fields_with_urls": fields_with_urls,
                },
            )

            meta.preview.save(
                f"job_{self.id}_preview.json",
                django.core.files.base.ContentFile(content=json.dumps(preview).encode()),
            )

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "datasource": self.datasource.meta_file_serialization(),
            "source_file_path": self.source_file_path,
            "source_file_version": self.source_file_version,
            "steps": [
                step.meta_file_serialization() for step in self.steps.order_by("exec_order").iterator()
            ],
        }
        return data

    def schedule(self):
        file_size = self.datasource.file.size if self.datasource.file else settings.EXT_QUEUE_LIMIT
        return services.schedule_job_scripts_processing(self, file_size)

    def schedule_update_meta(self):
        return MetaDataModel.schedule_update_meta(obj=self)


class DataSourceJobMetaData(SoftDeleteObject, MetaDataModel):
    job: DataSourceJob = models.OneToOneField(
        DataSourceJob, on_delete=models.CASCADE, related_name="meta_data"
    )

    def __str__(self):
        return f"Job {self.job} meta"

    def relative_path_to_save(self, filename):
        base_path = self.preview.storage.location

        return os.path.join(base_path, f"{self.job.datasource.id}/previews/{filename}")


class DataSourceJobStep(SoftDeleteObject, models.Model):
    datasource_job = models.ForeignKey(DataSourceJob, on_delete=models.CASCADE, related_name="steps")
    script = models.ForeignKey(WranglingScript, on_delete=models.SET_NULL, related_name="steps", null=True)
    body = models.TextField(blank=True)
    exec_order = models.IntegerField(default=0)
    options: dict = pg_fields.JSONField(default=dict, blank=True)

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "body": self.body,
            "script": self.script.meta_file_serialization(),
            "exec_order": self.exec_order,
            "options": self.options,
        }
        return data


class Filter(MetaGeneratorMixin, SoftDeleteObject, TimeStampedModel):
    datasource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name="filters")
    name = models.CharField(max_length=100)
    filter_type = models.CharField(max_length=25, choices=constants.FilterType.choices())
    field = models.TextField()
    field_type = models.CharField(max_length=25, choices=constants.FIELD_TYPE_CHOICES)
    unique_items = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["datasource", "name"],
                name="unique_datasource_filter",
                condition=models.Q(deleted_at=None),
            )
        ]

    @functional.cached_property
    def project_info(self):
        project = self.datasource.project
        return dict(id=project.id, title=project.title)

    def get_fields_info(self):
        last_job = self.datasource.active_job
        return json.loads(last_job.meta_data.preview.read())

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "name": self.name,
            "type": self.filter_type or None,
            "field": self.field or None,
        }
        return data


class DataSourceTag(SoftDeleteObject):
    datasource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name="tags")
    category = models.ForeignKey("tags.TagCategory", on_delete=models.SET_NULL, null=True)
    value = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.id}"
