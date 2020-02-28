import softdelete.models
from django.db import models
from django.db.models.functions import Coalesce

from ..utils.managers import generate_soft_delete_manager


class ProjectQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_data_source_count(self):
        from ..datasources.models import DataSource

        subquery = (
            DataSource.objects.order_by()
            .values("project")
            .filter(project=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )
        return self.annotate(
            data_source_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )

    def annotate_states_count(self):
        from ..states.models import State

        subquery = (
            State.objects.order_by()
            .values("project")
            .filter(project=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )
        return self.annotate(
            state_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )

    def annotate_templates_count(self):
        return self.annotate(
            block_templates=models.Count("blocktemplate", distinct=True),
            page_templates=models.Count("pagetemplate", distinct=True),
        )


ProjectManager = generate_soft_delete_manager(queryset_class=ProjectQuerySet)
