import json
import os

from pandas import read_csv

from django.db import models, transaction
from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models


from . import constants


def file_upload_path(instance, filename):
    return instance.relative_path_to_save(filename)


# Create your models here.
class Project(ext_models.TitleSlugDescriptionModel, ext_models.TimeStampedModel, models.Model):
    status = models.CharField(
        max_length=25, choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.INITIAL
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")


class DataSourceManager(models.Manager):
    def create(self, *args, **kwargs):
        file = kwargs.pop('file')
        dsource = super().create(*args, **kwargs)

        if file:
            dsource.file.save(file.name, file)

        return dsource


class DataSource(ext_models.TimeStampedModel, models.Model):
    name = models.CharField(max_length=25, null=True)
    type = models.CharField(max_length=25, choices=constants.DATA_SOURCE_TYPE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='data_sources')
    status = models.CharField(
        max_length=25, choices=constants.DATA_SOURCE_STATUS_CHOICES, default=constants.DataSourceStatus.DRAFT
    )
    file = models.FileField(
        null=True,
        upload_to=file_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['csv'],
            )
        ]
    )

    objects = DataSourceManager()

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'project', )

    def save(self, *args, **kwargs):
        with transaction.atomic():
            super().save(*args, **kwargs)
            if self.file:
                self.update_meta()

    def update_meta(self):
        items, fields = read_csv(self.file).shape
        meta, _ = DataSourceMeta.objects.update_or_create(
            datasource=self, defaults={"fields": fields, "items": items}
        )

    def relative_path_to_save(self, filename):
        base_path = self.file.storage.location
        return os.path.join(
            base_path,
            f"{os.getenv('STORAGE_DIR')}/projects",
            f"{self.project_id}/datasources/{self.id}/{filename}"
        )

    def get_preview_data(self):
        data = read_csv(self.file.path, sep=None)

        table_preview = json.loads(data.head(5).to_json(orient='records'))
        fields_info = json.loads(data.describe(
            include='all',
            percentiles=[]
        ).to_json(orient='columns'))

        for key, value in dict(data.dtypes).items():
            fields_info[key]["dtype"] = value.name

        return table_preview, fields_info


class DataSourceMeta(models.Model):
    datasource = models.OneToOneField(DataSource, on_delete=models.CASCADE, related_name='meta_data')
    items = models.PositiveIntegerField()
    fields = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"DataSource {self.datasource} meta"
