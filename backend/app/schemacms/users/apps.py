from django.apps import AppConfig
from django.db.models import signals as db_signals

from . import signals


class UsersConfig(AppConfig):
    name = 'schemacms.users'

    def ready(self):
        from . import receivers  # noqa
        from . import models  # noqa

        signals.user_deactivated.connect(
            receivers.remove_from_projects,
            sender=models.User,
            dispatch_uid="users.receivers.remove_from_projects",
        )
        db_signals.post_delete.connect(
            receivers.remove_from_auth_backend,
            sender=models.User,
            dispatch_uid="users.receivers.remove_from_auth_backend",
        )
