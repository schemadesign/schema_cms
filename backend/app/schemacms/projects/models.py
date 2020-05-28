import django_fsm
import softdelete.models
from django.conf import settings
from django.db import models
from django.utils import functional
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models

from . import constants, managers
from ..users import constants as users_constants


class Project(
    softdelete.models.SoftDeleteObject, ext_models.TitleSlugDescriptionModel, ext_models.TimeStampedModel,
):
    status = django_fsm.FSMField(
        choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.IN_PROGRESS
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="projects", null=True
    )
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_projects", blank=True)
    domain = models.URLField(blank=True, default="")

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
        return self.data_sources.aggregate(sates_count=models.Count("states"))["sates_count"]

    @functional.cached_property
    def pages_count(self):
        return self.page_set.filter(is_template=False).count()

    @functional.cached_property
    def users_count(self):
        return self.editors.all().count()

    @functional.cached_property
    def charts_count(self):
        return 0  # just for mock purposes till charts will be implemented

    @functional.cached_property
    def templates_count(self):
        return {
            "blocks": self.block_templates,
            "pages": self.page_templates,
            "tags": self.tags_count,
            "states": 0,
        }

    @functional.cached_property
    def project_info(self):
        return {"id": self.id, "title": self.title, "domain": self.domain}
