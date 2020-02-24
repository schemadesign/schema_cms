from django.apps import AppConfig
from django.db.models import signals as db_signals


class DatasourcesConfig(AppConfig):
    name = "schemacms.datasources"

    def ready(self):
        from ..utils import receivers
        from . import models

        db_signals.post_save.connect(
            receivers.update_public_api_meta,
            sender=models.DataSource,
            dispatch_uid="projects.receivers.update_public_api_meta",
        )
