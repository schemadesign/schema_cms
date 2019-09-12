import io
import json
import os

import django_fsm
from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models, transaction
from django_extensions.db import models as ext_models
from pandas import read_csv

import schemacms.utils.models
from schemacms.projects import constants, managers
from schemacms.projects.models import data_source_meta


class DataSource(ext_models.TimeStampedModel, models.Model):
    name = models.CharField(max_length=constants.DATASOURCE_NAME_MAX_LENGTH, null=True)
    type = models.CharField(max_length=25, choices=constants.DATA_SOURCE_TYPE_CHOICES)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="data_sources")
    status = django_fsm.FSMField(
        choices=constants.DATA_SOURCE_STATUS_CHOICES, default=constants.DataSourceStatus.DRAFT
    )
    file = models.FileField(
        null=True,
        upload_to=schemacms.utils.models.file_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=["csv"])],
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="data_sources", null=True
    )

    objects = managers.DataSourceManager()

    class Meta:
        unique_together = ("name", "project")

    def __str__(self):
        # name could be None but __str__ method should always return string
        return self.name or str(self.id)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @django_fsm.transition(
        field=status,
        source=[
            constants.DataSourceStatus.DRAFT,
            constants.DataSourceStatus.READY_FOR_PROCESSING,
            constants.DataSourceStatus.ERROR,
            constants.DataSourceStatus.DONE,
        ],
        target=constants.DataSourceStatus.READY_FOR_PROCESSING,
        on_error=constants.DataSourceStatus.ERROR,
    )
    def preview_process(self):
        self.update_meta()

    @django_fsm.transition(
        field=status,
        source=constants.DataSourceStatus.DRAFT,
        target=constants.DataSourceStatus.READY_FOR_PROCESSING,
        permission=(lambda inst, user: bool(inst.file)),
    )
    def ready_for_processing(self):
        pass

    @django_fsm.transition(
        field=status, source=constants.DataSourceStatus.PROCESSING, target=constants.DataSourceStatus.DONE
    )
    def done(self):
        pass

    def update_meta(self):
        data_frame = read_csv(self.file.path, sep=None, engine="python")
        items, fields = data_frame.shape
        preview, fields_info = self.get_preview_data(data_frame)
        preview_json = io.StringIO()
        json.dump({"data": preview, "fields": fields_info}, preview_json, indent=4)

        with transaction.atomic():
            meta, _ = data_source_meta.DataSourceMeta.objects.update_or_create(
                datasource=self, defaults={"fields": fields, "items": items}
            )

            filename, _ = self.get_original_file_name()
            meta.preview.save(f"preview_{filename}.json", preview_json)

    def relative_path_to_save(self, filename):
        base_path = self.file.storage.location
        if not (self.id and self.project_id):
            raise ValueError("Project or DataSource id is not set")
        return os.path.join(
            base_path,
            f"{settings.STORAGE_DIR}/projects",
            f"{self.project_id}/datasources/{self.id}/{filename}",
        )

    def get_original_file_name(self):
        name, ext = os.path.splitext(os.path.basename(self.file.name))
        return name, os.path.basename(self.file.name)

    @staticmethod
    def get_preview_data(data_frame):
        table_preview = json.loads(data_frame.head(5).to_json(orient="records"))
        fields_info = json.loads(data_frame.describe(include="all", percentiles=[]).to_json(orient="columns"))

        for key, value in dict(data_frame.dtypes).items():
            fields_info[key]["dtype"] = value.name

        return table_preview, fields_info
