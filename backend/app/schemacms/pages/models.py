from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models
from django.utils import functional
from django_extensions.db.models import TimeStampedModel
from softdelete.models import SoftDeleteObject

from . import constants


class Element(models.Model):
    name = models.CharField(max_length=constants.ELEMENT_NAME_MAX_LENGTH)
    type = models.CharField(max_length=25, choices=constants.ELEMENT_TYPE_CHOICES)
    order = models.PositiveIntegerField(default=0)
    params = pg_fields.JSONField(default=dict, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"


class Template(SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    name = models.CharField(max_length=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_available = models.BooleanField(default=False)
    allow_add = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"

    @functional.cached_property
    def project_info(self):
        return self.project.project_info


class BlockTemplate(Template):
    pass


class BlockTemplateElement(Element):
    template = models.ForeignKey(BlockTemplate, on_delete=models.CASCADE, related_name="elements")


class PageTemplate(Template):
    blocks = models.ManyToManyField(BlockTemplate, related_name="page_templates", blank=True)
