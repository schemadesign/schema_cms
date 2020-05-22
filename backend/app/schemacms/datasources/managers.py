from softdelete.models import SoftDeleteQuerySet
from django.db import models, transaction

from .constants import ProcessingState
from ..authorization.authentication import LambdaUser
from ..utils.managers import generate_soft_delete_manager


class DataSourceQuerySet(SoftDeleteQuerySet):
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
        return self.annotate(
            filters_count=models.Count(
                "filters", filter=models.Q(filters__deleted_at__isnull=True), distinct=True,
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
        if isinstance(user, LambdaUser) or user.is_admin:
            return self

        return self.filter(project__editors=user)


DataSourceManager = generate_soft_delete_manager(queryset_class=DataSourceQuerySet)
