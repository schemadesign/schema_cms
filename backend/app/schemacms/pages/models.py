from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models
from django_extensions.db.models import TimeStampedModel
from softdelete.models import SoftDeleteObject

from . import constants


class Template(SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    name = models.CharField(max_length=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        abstract = True


class BlockTemplate(Template):
    items = pg_fields.JSONField(default=dict, blank=True, editable=False)

    def __str__(self):
        return f"{self.name}"


class PageTemplate(Template):
    blocks = models.ManyToManyField(BlockTemplate, related_name="page_templates")

    def __str__(self):
        return f"{self.name}"
