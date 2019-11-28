import itertools
import json
import logging
import os

import datatable as dt

import django.core.files.base
import django_fsm
import softdelete.models
from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models, transaction
from django.utils import functional
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models
from django.contrib.postgres import fields as pg_fields

from schemacms.users import constants as users_constants
from . import constants, managers, fsm, services
from schemacms.utils import models as utils_models


def file_upload_path(instance, filename):
    return instance.relative_path_to_save(filename)


def map_dataframe_dtypes(dtype):
    if dtype == "object":
        return "string"
    else:
        return dtype


def map_general_dtypes(dtype):
    if dtype.startswith("float") or dtype.startswith("int"):
        return constants.FieldType.NUMBER
    elif dtype.startswith("str"):
        return constants.FieldType.STRING
    elif dtype.startswith("bool"):
        return constants.FieldType.BOOLEAN
    elif dtype.startswith("date") or dtype.startswith("time"):
        return constants.FieldType.DATE
    else:
        return dtype


def get_preview_data(file):
    if hasattr(file, "temporary_file_path"):
        data_frame = dt.fread(file.read(), na_strings=["", ''], fill=True)
    else:
        data_frame = dt.fread(file, na_strings=["", ''], fill=True)

    items, fields = data_frame.shape

    if items == 0:
        return json.dumps({"data": [], "fields": {}}, indent=4).encode(), items, fields

    sample_of_5 = data_frame.head(5).to_pandas()

    table_preview = json.loads(sample_of_5.to_json(orient="records"))
    samples = json.loads(sample_of_5.head(1).to_json(orient="records"))

    fields_info = {}
    mean = data_frame.mean().to_dict()
    min = data_frame.min().to_dict()
    max = data_frame.max().to_dict()
    std = data_frame.sd().to_dict()
    unique = data_frame.nunique().to_dict()
    columns = data_frame.names

    for i in columns:
        fields_info[i] = {}
        fields_info[i]["mean"] = mean[i][0]
        fields_info[i]["min"] = min[i][0]
        fields_info[i]["max"] = max[i][0]
        fields_info[i]["std"] = std[i][0]
        fields_info[i]["unique"] = unique[i][0]
        fields_info[i]["count"] = items

    dtypes = {i: k for i, k in zip(columns, data_frame.stypes)}
    for key, value in dtypes.items():
        fields_info[key]["dtype"] = map_dataframe_dtypes(value.name)

    for key, value in samples[0].items():
        fields_info[key]["sample"] = value

    preview_json = json.dumps({"data": table_preview, "fields": fields_info}, indent=4).encode()

    del data_frame, sample_of_5

    return preview_json, items, fields


class MetaDataModel(models.Model):
    items = models.PositiveIntegerField()
    fields = models.PositiveSmallIntegerField()
    preview = models.FileField(null=True, upload_to=file_upload_path)

    class Meta:
        abstract = True

    @property
    def data(self):
        if not self.preview:
            return {}
        self.preview.seek(0)
        return json.loads(self.preview.read())


class Project(
    utils_models.MetaGeneratorMixin,
    softdelete.models.SoftDeleteObject,
    ext_models.TitleSlugDescriptionModel,
    ext_models.TimeStampedModel,
):
    status = django_fsm.FSMField(
        choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.IN_PROGRESS
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects")
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_projects", blank=True)

    objects = managers.ProjectManager()

    class Meta:
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")

    def __str__(self):
        return self.title

    def user_has_access(self, user):
        return user.is_admin or self.editors.filter(pk=user.id).exists()

    @classmethod
    def get_projects_for_user(cls, user):
        role = getattr(user, "role", users_constants.UserRole.UNDEFINED)
        if role == users_constants.UserRole.ADMIN:
            return cls.objects.all()
        elif role == users_constants.UserRole.EDITOR:
            return cls.objects.all().filter(editors=user)
        else:
            return cls.objects.none()

    @functional.cached_property
    def data_source_count(self):
        return self.data_sources.count()

    @functional.cached_property
    def pages_count(self):
        return self.folders.values("pages").count()

    @functional.cached_property
    def users_count(self):
        return self.editors.all().count()

    @functional.cached_property
    def charts_count(self):
        return 0  # just for mock purposes till charts will be implemented

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "owner": self.owner_id,
            "pages": [],
            "data_sources": [],
        }

        if self.data_sources:
            data_sources = [
                {"id": data_source.id, "name": data_source.name} for data_source in self.data_sources.all()
            ]
            data.update({"data_sources": data_sources})

        if self.folders:
            pages = [d.meta_file_serialization() for d in self.folders.all()]
            data.update({"pages": list(itertools.chain.from_iterable(pages))})

        return data

    def meta_file_path(self):
        path = super().meta_file_path()
        return os.path.join("projects", path)


class DataSource(
    utils_models.MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel
):
    name = models.CharField(max_length=constants.DATASOURCE_NAME_MAX_LENGTH, null=True)
    type = models.CharField(max_length=25, choices=constants.DATA_SOURCE_TYPE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="data_sources")
    file = models.FileField(
        null=True, upload_to=file_upload_path, validators=[FileExtensionValidator(allowed_extensions=["csv"])]
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="data_sources", null=True
    )
    active_job = models.ForeignKey(
        "projects.DataSourceJob",
        blank=True,
        on_delete=models.SET_NULL,
        related_name="data_sources",
        null=True,
    )

    objects = managers.DataSourceManager()

    class Meta:
        unique_together = ("name", "project")
        ordering = ('-created',)

    def __str__(self):
        return self.name or str(self.id)

    def update_meta(self, file=None, file_name=None):
        if not file:
            file = self.file.url

        try:
            preview_json, items, fields = get_preview_data(file)

            with transaction.atomic():
                meta, _ = DataSourceMeta.objects.update_or_create(
                    datasource=self, defaults={"fields": fields, "items": items}
                )
                file_name, _ = self.get_original_file_name(file_name)
                meta.preview.save(
                    f"{file_name}_preview.json", django.core.files.base.ContentFile(content=preview_json)
                )

        except Exception as e:
            return logging.error(f"Data Source {self.id} fail to create meta data - {e}")

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

    @functional.cached_property
    def filters_count(self):
        return self.filters.count()

    @property
    def available_scripts(self):
        return WranglingScript.objects.filter(
            models.Q(is_predefined=True) | models.Q(datasource=self)
        ).order_by("-is_predefined")

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
    def current_job(self):
        if self.active_job_id:
            return self.active_job
        return self.get_last_success_job()

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

    def get_last_success_job(self):
        try:
            return self.jobs.filter(job_state=constants.DataSourceJobState.SUCCESS).latest("created")
        except DataSourceJob.DoesNotExist:
            return None

    def result_fields_info(self):
        preview = self.current_job.meta_data.preview
        fields = json.loads(preview.read())["fields"]

        data = [{"name": key, "type": map_general_dtypes(value["dtype"])} for key, value in fields.items()]

        return data

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "name": self.name,
            "file": self.file.name,
            "items": 0,
            "result": "",
            "fields": [],
            "filters": [],
        }

        current_job = self.current_job

        if current_job:
            data.update(
                {
                    "items": current_job.meta_data.items,
                    "result": current_job.result.name or "",
                    "fields": self.result_fields_info(),
                }
            )
        if self.filters:
            filters = [f.meta_file_serialization() for f in self.filters.filter(is_active=True)]
            data.update({"filters": filters})
        return data


class DataSourceMeta(softdelete.models.SoftDeleteObject, MetaDataModel):
    datasource = models.OneToOneField(DataSource, on_delete=models.CASCADE, related_name="meta_data")

    def __str__(self):
        return f"DataSource {self.datasource} meta"

    def relative_path_to_save(self, filename):
        base_path = self.preview.storage.location

        return os.path.join(base_path, f"{self.datasource.id}/previews/{filename}")


class WranglingScript(softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    datasource = models.ForeignKey(
        DataSource, on_delete=models.CASCADE, related_name='scripts', blank=True, null=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="scripts", blank=True, null=True
    )
    name = models.CharField(max_length=constants.SCRIPT_NAME_MAX_LENGTH, blank=True)
    is_predefined = models.BooleanField(default=True)
    file = models.FileField(
        upload_to=file_upload_path, null=True, validators=[FileExtensionValidator(allowed_extensions=["py"])]
    )
    body = models.TextField(blank=True)
    last_file_modification = models.DateTimeField(null=True)

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


class DataSourceJob(
    utils_models.MetaGeneratorMixin,
    softdelete.models.SoftDeleteObject,
    ext_models.TimeStampedModel,
    fsm.DataSourceJobFSM,
):
    datasource: DataSource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='jobs')
    description = models.TextField(blank=True)
    source_file_path: str = models.CharField(max_length=255, editable=False)
    source_file_version = models.CharField(max_length=36, editable=False)
    result = models.FileField(upload_to=file_upload_path, null=True)
    error = models.TextField(blank=True, default="")

    def __str__(self):
        return f'DataSource Job #{self.pk}'

    @property
    def source_file_url(self):
        if not self.source_file_path:
            return ""
        filename = os.path.basename(self.source_file_path)
        params = {
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': self.source_file_path,
            'ResponseContentDisposition': f"attachment; filename={filename}",
        }
        if self.source_file_version:
            params['VersionId'] = self.source_file_version
        return services.s3.generate_presigned_url(ClientMethod='get_object', Params=params)

    def relative_path_to_save(self, filename):
        base_path = self.result.storage.location
        if self.id is None or self.datasource_id is None:
            raise ValueError("Job or DataSource ID is not set")
        return os.path.join(base_path, f"{self.datasource_id}/jobs/{self.id}/outputs/{filename}")

    def update_meta(self):
        preview_json, items, fields = get_preview_data(self.result.url)

        with transaction.atomic():
            meta, _ = DataSourceJobMetaData.objects.update_or_create(
                job=self, defaults={"fields": fields, "items": items}
            )

            meta.preview.save(
                f"job_{self.id}_preview.json", django.core.files.base.ContentFile(content=preview_json)
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


class DataSourceJobMetaData(softdelete.models.SoftDeleteObject, MetaDataModel):
    job: DataSourceJob = models.OneToOneField(
        DataSourceJob, on_delete=models.CASCADE, related_name="meta_data"
    )

    def __str__(self):
        return f"Job {self.job} meta"

    def relative_path_to_save(self, filename):
        base_path = self.preview.storage.location

        return os.path.join(base_path, f"{self.job.datasource.id}/previews/{filename}")


class DataSourceJobStep(softdelete.models.SoftDeleteObject, models.Model):
    datasource_job: DataSourceJob = models.ForeignKey(
        DataSourceJob, on_delete=models.CASCADE, related_name='steps'
    )
    script: WranglingScript = models.ForeignKey(
        WranglingScript, on_delete=models.CASCADE, related_name='steps', null=True
    )
    body = models.TextField(blank=True)
    exec_order = models.IntegerField(default=0)
    options: dict = pg_fields.JSONField(default=dict)

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "body": self.body,
            "script": self.script.meta_file_serialization(),
            "exec_order": self.exec_order,
            "options": self.options,
        }
        return data


# Filters


class Filter(
    utils_models.MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel
):
    datasource: DataSource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='filters')
    name = models.CharField(max_length=25)
    filter_type = models.CharField(max_length=25, choices=constants.FilterType.choices())
    field = models.CharField(max_length=25)
    field_type = models.CharField(max_length=25, choices=constants.FIELD_TYPE_CHOICES)
    unique_items = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        unique_together = ("name", "datasource")

    def get_fields_info(self):
        last_job = self.datasource.get_last_success_job()
        return json.loads(last_job.meta_data.preview.read())

    def meta_file_serialization(self):
        data = {"id": self.id, "name": self.name, "type": self.filter_type, "field": self.field}
        return data


# Pages


class Folder(
    utils_models.MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel
):
    project: Project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='folders')
    name = models.CharField(max_length=constants.DIRECTORY_NAME_MAX_LENGTH)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="folders", null=True
    )

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = _("Folder")
        verbose_name_plural = _("Folders")
        unique_together = ("name", "project")
        ordering = ('name',)

    def get_project(self):
        return self.project

    def meta_file_serialization(self):
        data = []

        for page in self.pages.all():
            page_dict = {
                "id": page.id,
                "title": page.title,
                "description": page.description,
                "folder": self.name,
                "keywords": page.keywords,
                "blocks": page.get_blocks(),
            }
            data.append(page_dict)

        return data


class Page(ext_models.TitleSlugDescriptionModel, ext_models.TimeStampedModel):
    folder: Folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='pages')
    keywords = models.TextField(blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pages", null=True
    )

    objects = managers.PageQuerySet().as_manager()

    def __str__(self):
        return str(self.pk)

    class Meta:
        unique_together = ("title", "folder")
        ordering = ('created',)

    @functional.cached_property
    def blocks_count(self):
        return self.blocks.count()

    @property
    def page_url(self):
        return os.path.join(
            settings.PUBLIC_API_LAMBDA_URL, "projects", str(self.folder.project_id), "pages", str(self.pk)
        )

    def get_project(self):
        return self.folder.project

    def get_blocks(self):
        blocks = []

        for block in self.blocks.filter(is_active=True):
            data = {
                "id": block.id,
                "name": block.name,
                "type": block.type,
                "content": block.content,
                "image": None if not block.image else block.image.url,
            }
            blocks.append(data)

        return blocks


class Block(utils_models.MetaGeneratorMixin, ext_models.TimeStampedModel):
    page: Page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="blocks")
    name = models.CharField(max_length=constants.BLOCK_NAME_MAX_LENGTH)
    type = models.CharField(max_length=25, choices=constants.BLOCK_TYPE_CHOICES)
    content = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to=file_upload_path, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.pk)

    class Meta:
        unique_together = ("name", "page")
        ordering = ('created',)

    def relative_path_to_save(self, filename):
        base_path = self.image.storage.location
        if not self.page_id:
            raise ValueError("Page is not set")
        return os.path.join(base_path, f"pages/{self.page_id}/{filename}")

    def get_original_image_name(self, file_name=None):
        if not file_name:
            file_name = self.image.name
        name, ext = os.path.splitext(os.path.basename(file_name))
        return name, os.path.basename(file_name)

    def get_project(self):
        return self.page.folder.project
