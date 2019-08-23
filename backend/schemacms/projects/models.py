from django.db import models
from django.conf import settings
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models

from . import constants


# Create your models here.
class Project(ext_models.TitleSlugDescriptionModel, ext_models.TimeStampedModel, models.Model):
    status = models.CharField(
        max_length=25, choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.INITIAL
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")
