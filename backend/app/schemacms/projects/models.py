import json
import os

import django.core.files.base
import django_fsm
from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models, transaction
from django.utils import functional
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models
from django_fsm import signals as fsm_signals
from pandas import read_csv

from schemacms.projects import handlers
from schemacms.projects import services
from schemacms.users import constants as users_constants
from . import constants, managers, fsm


def file_upload_path(instance, filename):
    return instance.relative_path_to_save(filename)


class Project(ext_models.TitleSlugDescriptionModel, ext_models.TimeStampedModel):
    status = django_fsm.FSMField(
        choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.IN_PROGRESS
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects")
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL)

    objects = managers.ProjectQuerySet.as_manager()

    class Meta:
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")

    def __str__(self):
        return self.title

    def user_has_access(self, user):
        return self.get_projects_for_user(user).filter(pk=self.id).exists()

    @classmethod
    def get_projects_for_user(cls, user):
        role = getattr(user, "role", users_constants.UserRole.UNDEFINED)
        if role == users_constants.UserRole.ADMIN:
            return cls.objects.all()
        elif role == users_constants.UserRole.EDITOR:
            return cls.objects.filter(editors=user)
        else:
            return cls.objects.none()

    @functional.cached_property
    def data_source_count(self):
        return self.data_sources.count()


class DataSource(ext_models.TimeStampedModel, fsm.DataSourceProcessingFSM):
    name = models.CharField(max_length=constants.DATASOURCE_NAME_MAX_LENGTH, null=True)
    type = models.CharField(max_length=25, choices=constants.DATA_SOURCE_TYPE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="data_sources")
    file = models.FileField(
        null=True, upload_to=file_upload_path, validators=[FileExtensionValidator(allowed_extensions=["csv"])]
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="data_sources", null=True
    )

    objects = managers.DataSourceManager()

    class Meta:
        unique_together = ("name", "project")

    def __str__(self):
        return self.name or str(self.id)

    def update_meta(self):
        data_frame = read_csv(self.file.url, sep=None, engine="python", encoding='ISO-8859-1')
        items, fields = data_frame.shape
        preview, fields_info = self.get_preview_data(data_frame)
        preview_json = json.dumps({"data": preview, "fields": fields_info}, indent=4).encode()

        with transaction.atomic():
            meta, _ = DataSourceMeta.objects.update_or_create(
                datasource=self, defaults={"fields": fields, "items": items}
            )

            filename, _ = self.get_original_file_name()
            meta.preview.save(
                f"preview_{filename}.json", django.core.files.base.ContentFile(content=preview_json)
            )

    def relative_path_to_save(self, filename):
        base_path = self.file.storage.location
        if not (self.id and self.project_id):
            raise ValueError("Project or DataSource id is not set")
        return os.path.join(
            base_path,
            f"{settings.STORAGE_DIR}/projects",
            f"{self.project_id}/datasources/{self.id}/{filename}",
        )

    def get_original_file_name(self):
        name, ext = os.path.splitext(os.path.basename(self.file.name))
        return name, os.path.basename(self.file.name)

    @staticmethod
    def get_preview_data(data_frame):
        table_preview = json.loads(data_frame.head(5).to_json(orient="records"))
        fields_info = json.loads(data_frame.describe(include="all", percentiles=[]).to_json(orient="columns"))

        for key, value in dict(data_frame.dtypes).items():
            fields_info[key]["dtype"] = value.name

        return table_preview, fields_info

    @property
    def available_scripts(self):
        return services.scripts.list(self)


fsm_signals.post_transition.connect(handlers.handle_datasource_fsm_post_transition, sender=DataSource)


class DataSourceMeta(models.Model):
    datasource = models.OneToOneField(DataSource, on_delete=models.CASCADE, related_name="meta_data")
    items = models.PositiveIntegerField()
    fields = models.PositiveSmallIntegerField()
    preview = models.FileField(null=True, upload_to=file_upload_path)

    def __str__(self):
        return f"DataSource {self.datasource} meta"

    def relative_path_to_save(self, filename):
        base_path = self.preview.storage.location

        return os.path.join(
            base_path,
            f"{settings.STORAGE_DIR}/projects",
            f"{self.datasource.project_id}/datasources/{self.datasource.id}/{filename}",
        )

    @property
    def data(self):
        if not self.preview:
            return {}
        self.preview.seek(0)
        return json.loads(self.preview.read())


class WranglingScript(ext_models.TimeStampedModel):
    datasource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='scripts', null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="scripts", null=True
    )
    name = models.CharField(max_length=constants.SCRIPT_NAME_MAX_LENGTH, blank=True)
    is_predefined = models.BooleanField(default=True)
    file = models.FileField(
        upload_to="scripts/",
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=["py"])],
    )
    body = models.TextField(blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.body:
            self.body = self.file.read().decode()
        super(WranglingScript, self).save(*args, **kwargs)


class DataSourceJob(ext_models.TimeStampedModel, fsm.DataSourceJobFSM):
    datasource = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='jobs')
    result = models.FileField(upload_to=file_upload_path, null=True)
    error = models.TextField(blank=True, default="")

    def __str__(self):
        return f'DataSource Job #{self.pk}'

    def relative_path_to_save(self, filename):
        base_path = self.result.storage.location

        return os.path.join(
            base_path,
            f"{settings.STORAGE_DIR}/projects",
            f"{self.datasource.project_id}/datasources/{self.datasource.id}/results_{filename}",
        )


class DataSourceJobStep(models.Model):
    datasource_job = models.ForeignKey(DataSourceJob, on_delete=models.CASCADE, related_name='steps')
    script = models.ForeignKey(WranglingScript, on_delete=models.CASCADE, related_name='steps', null=True)
    exec_order = models.IntegerField(default=0)
