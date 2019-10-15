from django.apps import AppConfig

from . import signals


class UsersConfig(AppConfig):
    name = 'schemacms.users'

    def ready(self):
        from . import receivers  # noqa

        signals.user_deactivated.connect(
            receivers.remove_from_projects, dispatch_uid="users.receivers.remove_from_projects"
        )
