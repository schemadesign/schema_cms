import os

from django.db import models
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


class DataSource(ext_models.TimeStampedModel, models.Model):
    name = models.CharField(max_length=25)
    type = models.CharField(max_length=25, choices=constants.DATA_SOURCE_TYPE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='data_sources')
    status = models.CharField(
        max_length=25, choices=constants.DATA_SOURCE_STATUS_CHOICES, default=constants.DataSourceStatus.INITIAL
    )
    file = models.FileField(
        upload_to=file_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['csv'],
            )
        ]
    )

    class Meta:
        unique_together = ('name', 'project', )

    def __str__(self):
        return self.name

    def relative_path_to_save(self, filename):
        base_path = self.file.storage.location
        return os.path.join(
            base_path,
            f"{os.getenv('STORAGE_DIR')}/projects",
            f"{self.project_id}/datasources/{self.name.replace(' ','_')}/{filename}"
        )


class DataSourceMeta(models.Model):
    datasource = models.OneToOneField(DataSource, on_delete=models.CASCADE, related_name='meta_data')
    items = models.PositiveIntegerField()
    fields = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"DataSource {self.datasource} meta"
