from django.apps import AppConfig
from django.db.models import signals as db_signals


class ProjectsConfig(AppConfig):
    name = 'schemacms.projects'

    def ready(self):
        from . import receivers  # noqa
        from . import models  # noqa

        db_signals.post_save.connect(
            receivers.update_meta_file,
            sender=models.DataSource,
            dispatch_uid="projects.receivers.update_meta_file",
        )

        db_signals.post_save.connect(
            receivers.update_meta_file,
            sender=models.Project,
            dispatch_uid="projects.receivers.update_meta_file",
        )

        db_signals.post_save.connect(
            receivers.update_meta_file,
            sender=models.Folder,
            dispatch_uid="projects.receivers.update_meta_file",
        )

        db_signals.post_save.connect(
            receivers.update_meta_file, sender=models.Page, dispatch_uid="projects.receivers.update_meta_file"
        )
        db_signals.post_save.connect(
            receivers.update_meta_file,
            sender=models.Block,
            dispatch_uid="projects.receivers.update_meta_file",
        )
