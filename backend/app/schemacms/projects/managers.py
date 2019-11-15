import softdelete.models
from django.db import models, transaction


class ProjectQuerySet(softdelete.models.SoftDeleteQuerySet):
    def annotate_data_source_count(self):
        return self.annotate(data_source_count=models.Count("data_sources"))


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

        return dsource

    def available_for_user(self, user):
        """Return Datasouces available for user. If user is admin then return all datasources
        else returns datasources where user is assigned as project's editor"""
        if user.is_admin:
            return self
        return self.filter(project__editors=user)


DataSourceManager = generate_soft_delete_manager(queryset_class=DataSourceQuerySet)
