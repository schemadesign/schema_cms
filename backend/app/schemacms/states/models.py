from softdelete.models import SoftDeleteObject
from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models
from django_extensions.db.models import TimeStampedModel


class State(SoftDeleteObject, TimeStampedModel):
    name = models.CharField(max_length=100)
    datasource = models.ForeignKey(
        "datasources.DataSource", on_delete=models.CASCADE, related_name="states", null=True
    )
    description = models.TextField(blank=True, default="")
    source_url = models.TextField(blank=True, default="")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="states", null=True
    )
    is_public = models.BooleanField(default=True)
    filters = models.ManyToManyField("datasources.Filter", through="InStateFilter")

    def __str__(self):
        return self.name or str(self.pk)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "datasource"], name="unique_state_name", condition=models.Q(deleted_at=None)
            )
        ]
        ordering = ("created",)

    def add_tags(self, tags_list):
        self.tags.all().delete()

        for tag in tags_list:
            StateTag.objects.create(state=self, category_id=tag["category"], value=tag["value"])


class InStateFilter(SoftDeleteObject):
    filter = models.ForeignKey("datasources.Filter", on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    filter_type = models.CharField(max_length=100)
    field = models.TextField()
    field_type = models.CharField(max_length=100)
    condition = pg_fields.JSONField(blank=True, default=dict)


class StateTag(SoftDeleteObject):
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name="tags")
    category = models.ForeignKey("tags.TagCategory", on_delete=models.SET_NULL, null=True)
    value = models.CharField(max_length=150)
