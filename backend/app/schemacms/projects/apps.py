from django.apps import AppConfig
from django.db.models import signals as db_signals


class ProjectsConfig(AppConfig):
    name = "schemacms.projects"

    def ready(self):
        from ..utils import receivers
        from . import models

        db_signals.post_save.connect(
            receivers.update_public_api_meta,
            sender=models.Project,
            dispatch_uid="utils.receivers.update_public_api_meta",
        )

        db_signals.post_save.connect(
            receivers.update_public_api_meta,
            sender=models.Folder,
            dispatch_uid="utils.receivers.update_public_api_meta",
        )

        db_signals.post_save.connect(
            receivers.update_public_api_meta,
            sender=models.Page,
            dispatch_uid="utils.receivers.update_public_api_meta",
        )
