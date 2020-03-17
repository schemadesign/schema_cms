import softdelete.models
from django.db import models

from ..utils.managers import generate_soft_delete_manager


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
