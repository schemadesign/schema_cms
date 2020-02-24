import softdelete.models
from django.db import models, transaction
from django.db.models.functions import Coalesce

from ..authorization.authentication import LambdaUser
from ..utils.managers import generate_soft_delete_manager
from .constants import ProcessingState


class DataSourceQuerySet(softdelete.models.SoftDeleteQuerySet):
    @transaction.atomic()
    def create(self, *args, **kwargs):
        from .models import DataSourceMeta

        file = kwargs.pop("file", None)
        dsource = super().create(*args, **kwargs)

        if file:
            dsource.file.save(file.name, file)

        DataSourceMeta.objects.create(datasource=dsource)

        return dsource

    def annotate_filters_count(self):
        from .models import Filter

        subquery = (
            Filter.objects.order_by()
            .values("datasource")
            .filter(datasource=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )

        return self.annotate(
            filters_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()),
                models.Value(0),
            )
        )

    def annotate_tags_count(self):
        from ..projects.models import TagsList

        subquery = (
            TagsList.objects.order_by()
            .values("datasource")
            .filter(datasource=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )

        return self.annotate(
            tags_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()),
                models.Value(0),
            )
        )

    def jobs_in_process(self):
        from .models import DataSourceJob

        subquery = DataSourceJob.objects.filter(
            datasource=models.OuterRef("pk"),
            job_state__in=[ProcessingState.PENDING, ProcessingState.PROCESSING],
        )

        return self.annotate(jobs_in_process=models.Exists(subquery))

    def available_for_user(self, user):
        """Return Datasouces available for user. If user is admin then return all datasources
        else returns datasources where user is assigned as project's editor"""
        if isinstance(user, LambdaUser) or user.is_admin:
            return self
        return self.filter(project__editors=user)


DataSourceManager = generate_soft_delete_manager(queryset_class=DataSourceQuerySet)
