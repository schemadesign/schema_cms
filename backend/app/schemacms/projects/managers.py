from django.db import models, transaction
from hashids import Hashids

from . import constants


class ProjectQuerySet(models.QuerySet):
    def annotate_data_source_count(self):
        return self.annotate(data_source_count=models.Count("data_sources"))


class DataSourceQuerySet(models.QuerySet):
    def create(self, *args, **kwargs):
        file = kwargs.pop("file", None)

        with transaction.atomic():
            dsource = super().create(*args, **kwargs)

            if not kwargs.get("name", None):
                data_source_number = Hashids(min_length=4).encode(dsource.id)
                dsource.name = f"{constants.DATASOURCE_DRAFT_NAME} #{data_source_number}"
                dsource.save()

            if file:
                dsource.file.save(file.name, file)

        return dsource

    def available_for_user(self, user):
        """Return Datasouces available for user. If user is admin then return all datasources
        else returns datasources where user is assigned as project's editor"""
        if user.is_admin:
            return self
        return self.filter(project__editors=user)

