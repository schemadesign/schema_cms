import softdelete.models
from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models
from django_extensions.db import models as ext_models

from ..utils.models import MetaGeneratorMixin


class TagsList(MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    datasource = models.ForeignKey(
        "datasources.DataSource", on_delete=models.CASCADE, related_name="list_of_tags"
    )
    name = models.CharField(max_length=25)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name or str(self.pk)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["datasource", "name"],
                name="unique_tags_list_name",
                condition=models.Q(deleted_at=None),
            )
        ]
        ordering = ("created",)

    def meta_file_serialization(self):
        data = dict(
            id=self.id, name=self.name, tags=[tag.meta_file_serialization() for tag in self.tags.all()]
        )
        return data


class Tag(MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    tags_list: TagsList = models.ForeignKey(TagsList, on_delete=models.CASCADE, related_name="tags")
    value = models.CharField(max_length=150)
    exec_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.value or str(self.pk)

    class Meta:
        ordering = ("created",)

    def meta_file_serialization(self):
        data = {"id": self.id, "list": self.tags_list.name, "value": self.value}
        return data


class State(MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="states")
    name = models.CharField(max_length=50)
    datasource = models.ForeignKey(
        "datasources.DataSource", on_delete=models.SET_NULL, related_name="states", null=True
    )
    description = models.TextField(blank=True, default="")
    source_url = models.TextField(blank=True, default="")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="states", null=True
    )
    is_public = models.BooleanField(default=True)
    active_tags = pg_fields.ArrayField(models.IntegerField(), null=True, default=list)
    filters = models.ManyToManyField("datasources.Filter", through="InStateFilter")

    def __str__(self):
        return self.name or str(self.pk)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name"], name="unique_state_name", condition=models.Q(deleted_at=None)
            )
        ]
        ordering = ("created",)


class InStateFilter(MetaGeneratorMixin, softdelete.models.SoftDeleteObject):
    filter = models.ForeignKey("datasources.Filter", on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    filter_type = models.CharField(max_length=25)
    field = models.TextField()
    field_type = models.CharField(max_length=25)
    condition = pg_fields.JSONField(blank=True, default=dict)
