import softdelete.models
from django.db import models

from ..utils.managers import generate_soft_delete_manager


class ProjectQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_data_source_count(self):
        return self.annotate(
            data_source_count=models.Count(
                "data_sources", filter=models.Q(data_sources__deleted_at__isnull=True), distinct=True
            )
        )

    def annotate_states_count(self):
        return self.annotate(
            states_count=models.Count(
                "data_sources__states",
                filter=models.Q(data_sources__states__deleted_at__isnull=True),
                distinct=True,
            )
        )

    def annotate_templates_count(self):
        return self.annotate(
            block_templates=models.Count(
                "blocktemplate", filter=models.Q(blocktemplate__deleted_at__isnull=True), distinct=True,
            ),
            page_templates=models.Count(
                "page", filter=models.Q(page__deleted_at__isnull=True, page__is_template=True), distinct=True
            ),
        )

    def annotate_pages_count(self):
        return self.annotate(
            pages_count=models.Count(
                "page", filter=models.Q(page__deleted_at__isnull=True, page__is_template=False), distinct=True
            ),
        )


ProjectManager = generate_soft_delete_manager(queryset_class=ProjectQuerySet)
