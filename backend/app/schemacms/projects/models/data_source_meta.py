import os

from django.conf import settings
from django.db import models

import schemacms.utils.models


class DataSourceMeta(models.Model):
    datasource = models.OneToOneField(
        "projects.DataSource", on_delete=models.CASCADE, related_name="meta_data"
    )
    items = models.PositiveIntegerField()
    fields = models.PositiveSmallIntegerField()
    preview = models.FileField(null=True, upload_to=schemacms.utils.models.file_upload_path)

    def __str__(self):
        return f"DataSource {self.datasource} meta"

    def relative_path_to_save(self, filename):
        base_path = self.preview.storage.location

        return os.path.join(
            base_path,
            f"{settings.STORAGE_DIR}/projects",
            f"{self.datasource.project_id}/datasources/{self.datasource.id}/{filename}",
        )
