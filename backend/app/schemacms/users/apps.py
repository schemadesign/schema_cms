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
        signals.user_invited.connect(
            receivers.assign_external_account,
            sender=models.User,
            dispatch_uid="users.receivers.user_invited",
        )
        signals.user_invited.connect(
            receivers.send_invitation_email,
            sender=models.User,
            dispatch_uid="users.receivers.send_invitation_email",
        )
        db_signals.post_delete.connect(
            receivers.remove_from_auth_backend,
            sender=models.User,
            dispatch_uid="users.receivers.remove_from_auth_backend",
        )
