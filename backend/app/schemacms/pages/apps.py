from django.apps import AppConfig


class PagesConfig(AppConfig):
    name = "schemacms.pages"

    def ready(self):
        from . import signals  # noqa
