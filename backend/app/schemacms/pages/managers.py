import softdelete.models
from django.db import models

from ..utils.managers import generate_soft_delete_manager


class PageTemplateManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_template=True)


class PageManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_template=False)


class SectionQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_pages_count(self):
        return self.annotate(
            pages_count=models.Count(
                "pages",
                filter=models.Q(pages__deleted_at__isnull=True, pages__is_template=False),
                distinct=True,
            )
        )


SectionManager = generate_soft_delete_manager(queryset_class=SectionQuerySet)
