from softdelete.models import SoftDeleteObject
from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models
from django_extensions.db.models import TimeStampedModel


class State(SoftDeleteObject, TimeStampedModel):
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


class InStateFilter(SoftDeleteObject):
    filter = models.ForeignKey("datasources.Filter", on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    filter_type = models.CharField(max_length=25)
    field = models.TextField()
    field_type = models.CharField(max_length=25)
    condition = pg_fields.JSONField(blank=True, default=dict)
