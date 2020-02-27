import django_fsm
import softdelete.models
from django.conf import settings
from django.db import models
from django.utils import functional
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models

from . import constants, managers
from ..users import constants as users_constants
from ..utils.models import MetaGeneratorMixin


class Project(
    MetaGeneratorMixin,
    softdelete.models.SoftDeleteObject,
    ext_models.TitleSlugDescriptionModel,
    ext_models.TimeStampedModel,
):
    status = django_fsm.FSMField(
        choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.IN_PROGRESS
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="projects", null=True
    )
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_projects", blank=True)

    objects = managers.ProjectManager()

    class Meta:
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")

    def __str__(self):
        return self.title

    def user_has_access(self, user):
        return user.is_admin or self.editors.filter(pk=user.id).exists()

    @classmethod
    def get_projects_for_user(cls, user):
        role = getattr(user, "role", users_constants.UserRole.UNDEFINED)
        if role == users_constants.UserRole.ADMIN:
            return cls.objects.all()
        elif role == users_constants.UserRole.EDITOR:
            return cls.objects.all().filter(editors=user)
        else:
            return cls.objects.none()

    @functional.cached_property
    def data_source_count(self):
        return self.data_sources.count()

    @functional.cached_property
    def states_count(self):
        return self.states.count()

    @functional.cached_property
    def pages_count(self):
        return 0

    @functional.cached_property
    def users_count(self):
        return self.editors.all().count()

    @functional.cached_property
    def charts_count(self):
        return 0  # just for mock purposes till charts will be implemented

    @functional.cached_property
    def templates_count(self):
        return {"blocks": self.block_templates, "pages": self.page_templates, "filters": 0, "states": 0}

    @functional.cached_property
    def project_info(self):
        return {"id": self.id, "title": self.title}

    @property
    def dynamo_table_name(self):
        return "projects"

    def meta_file_serialization(self):
        data = {
            "id": self.id,
            "meta": {
                "title": self.title,
                "description": self.description or None,
                "owner": None if not self.owner else self.owner.get_full_name(),
                "created": self.created.isoformat(),
                "updated": self.modified.isoformat(),
            },
            "data_sources": [],
            "pages": [],
        }

        if self.data_sources:
            data_sources = [
                {"id": data_source.id, "name": data_source.name, "type": data_source.type}
                for data_source in self.data_sources.all()
            ]
            data.update({"data_sources": data_sources})

        return data
