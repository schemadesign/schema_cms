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

    def annotate_pages_count(self):
        from .models import Page

        subquery = (
            Page.objects.order_by()
            .values("folder__project")
            .filter(folder__project=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )
        return self.annotate(
            pages_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )


ProjectManager = generate_soft_delete_manager(queryset_class=ProjectQuerySet)


class PageQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_blocks_count(self):
        from .models import Block

        subquery = (
            Block.objects.order_by()
            .values("page")
            .filter(page=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )
        return self.annotate(
            blocks_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )


PageManager = generate_soft_delete_manager(queryset_class=PageQuerySet)
