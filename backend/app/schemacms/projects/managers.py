import softdelete.models
from django.db import models, transaction
from django.db.models.functions import Coalesce


class ProjectQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_data_source_count(self):
        from .models import DataSource

        subquery = (
            DataSource.objects.order_by()
            .values('project')
            .filter(project=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )
        return self.annotate(
            data_source_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )

    def annotate_pages_count(self):
        from .models import Page

        subquery = (
            Page.objects.order_by()
            .values('folder__project')
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
    def create(self, *args, **kwargs):
        file = kwargs.pop("file", None)

        with transaction.atomic():
            dsource = super().create(*args, **kwargs)

            if file:
                dsource.update_meta(file=file, file_name=file.name)
                file.seek(0)
                dsource.file.save(file.name, file)
                dsource.project.create_meta_file()

        return dsource

    def annotate_filters_count(self):
        from .models import Filter

        subquery = (
            Filter.objects.order_by()
            .values('datasource')
            .filter(datasource=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )

        return self.annotate(
            filters_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )

    def available_for_user(self, user):
        """Return Datasouces available for user. If user is admin then return all datasources
        else returns datasources where user is assigned as project's editor"""
        if user.is_admin:
            return self
        return self.filter(project__editors=user)


DataSourceManager = generate_soft_delete_manager(queryset_class=DataSourceQuerySet)


class PageQuerySet(models.QuerySet):
    def annotate_blocks_count(self):
        from .models import Block

        subquery = (
            Block.objects.order_by()
            .values('page')
            .filter(page=models.OuterRef("pk"))
            .annotate(count=models.Count("pk"))
            .values("count")
        )
        return self.annotate(
            blocks_count=Coalesce(
                models.Subquery(subquery, output_field=models.IntegerField()), models.Value(0)
            )
        )
