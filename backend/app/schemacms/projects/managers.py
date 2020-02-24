import softdelete.models
from django.db import models, transaction
from django.db.models.functions import Coalesce

from ..authorization.authentication import LambdaUser
from .constants import ProcessingState


class ProjectQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_data_source_count(self):
        from .models import DataSource

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
        from .models import State

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


def generate_soft_delete_manager(queryset_class):
    class _soft_delete_manager_class(softdelete.models.SoftDeleteManager):
        def get_query_set(self):
            qs = super().get_query_set()
            qs.__class__ = queryset_class
            return qs

        def get_queryset(self):
            qs = super().get_queryset()
            qs.__class__ = queryset_class
            return qs

        def all_with_deleted(self, prt=False):
            qs = super().all_with_deleted(prt)
            qs.__class__ = queryset_class
            return qs

        def deleted_set(self):
            qs = super().deleted_set()
            qs.__class__ = queryset_class
            return qs

        def filter(self, *args, **kwargs):
            qs = super().filter(*args, **kwargs)
            qs.__class__ = queryset_class
            return qs

    return _soft_delete_manager_class


ProjectManager = generate_soft_delete_manager(queryset_class=ProjectQuerySet)


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
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )

    def annotate_tags_count(self):
        from .models import TagsList

        subquery = (
            TagsList.objects.order_by()
            .values("datasource")
            .filter(datasource=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )

        return self.annotate(
            tags_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
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
