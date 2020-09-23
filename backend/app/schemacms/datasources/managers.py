from softdelete.models import SoftDeleteQuerySet
from django.db import models, transaction

from .constants import ProcessingState
from ..authorization.authentication import LambdaUser
from ..utils.managers import generate_soft_delete_manager


class DataSourceMetaManager(models.Manager):
    def get_by_natural_key(self, project_title, data_source_name):
        return self.get(datasource__name=data_source_name, datasource__project__title=project_title)


class DataSourceJobManager(models.Manager):
    def get_by_natural_key(self, project_title, data_source_name, source_file_path, source_file_version):
        return self.get(
            source_file_path=source_file_path,
            source_file_version=source_file_version,
            datasource__name=data_source_name,
            datasource__project__title=project_title,
        )


class DataSourceJobMetaManager(models.Manager):
    def get_by_natural_key(self, project_title, data_source_name, source_file_path, source_file_version):
        return self.get(
            job__source_file_path=source_file_path,
            job__source_file_version=source_file_version,
            job__datasource__name=data_source_name,
            job__datasource__project__title=project_title,
        )


class DataSourceTagManager(models.Manager):
    def get_by_natural_key(self, project_title, datasource_name, category_name, value):
        return self.get(
            datasource__project__title=project_title,
            datasource__name=datasource_name,
            category_name=category_name,
            value=value,
        )


class DataSourceQuerySet(SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, name):
        return self.get(name=name, project__title=project_title)

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
