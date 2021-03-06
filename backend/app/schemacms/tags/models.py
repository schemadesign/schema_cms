from softdelete.models import SoftDeleteObject
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext as _
from django_extensions.db.models import TimeStampedModel

from django.contrib.postgres.fields import JSONField
from . import managers


def default_category_type():
    return {"content": False, "dataset": False}


class TagCategory(SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="tags_categories", null=True
    )
    name = models.CharField(max_length=100)
    type = JSONField(blank=True, default=default_category_type)
    is_single_select = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="tags_categories", null=True
    )

    objects = managers.TagCategoryManager()

    class Meta:
        verbose_name = _("Tag Category")
        verbose_name_plural = _("Tag Categories")
        constraints = [
            models.UniqueConstraint(
                fields=["name", "project"],
                name="unique_tag_category_name",
                condition=models.Q(deleted_at=None),
            )
        ]
        ordering = ("name",)

    def __str__(self):
        return f"{self.name}"

    def natural_key(self):
        return self.project.title, self.name

    natural_key.dependencies = ["projects.project"]

    def update_or_create_tags(self, tags):
        for tag in tags:
            Tag.objects.update_or_create(id=tag.pop("id", None), defaults={"category": self, **tag})

    def delete_tags(self, tags_ids):
        self.tags.filter(id__in=tags_ids).delete()


class Tag(SoftDeleteObject, TimeStampedModel):
    category = models.ForeignKey(TagCategory, on_delete=models.CASCADE, related_name="tags")
    value = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=0)

    objects = managers.TagManager()

    class Meta:
        ordering = ("created",)

    def __str__(self):
        return f"{self.value}"

    def natural_key(self):
        return self.category.project.title, self.category.name, self.value

    natural_key.dependencies = ["tags.tagcategory"]
