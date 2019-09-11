from django.db import models


class ProjectQuerySet(models.QuerySet):
    def annotate_data_source_count(self):
        return self.annotate(data_source_count=models.Count("data_sources"))
