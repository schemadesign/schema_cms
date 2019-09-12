from django.db import transaction
from django.db import models
import hashids

from schemacms.projects import constants


class ProjectQuerySet(models.QuerySet):
    def annotate_data_source_count(self):
        return self.annotate(data_source_count=models.Count("data_sources"))


class DataSourceManager(models.Manager):
    def create(self, *args, **kwargs):
        file = kwargs.pop("file", None)

        with transaction.atomic():
            dsource = super().create(*args, **kwargs)

            if not kwargs.get("name", None):
                data_source_number = hashids.Hashids(min_length=4).encode(dsource.id)
                dsource.name = f"{constants.DATASOURCE_DRAFT_NAME} #{data_source_number}"
                dsource.save()

            if file:
                dsource.file.save(file.name, file)

        return dsource
