import os
from io import BytesIO

from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import functional
from django.utils.translation import ugettext as _
from django_extensions.db.models import TimeStampedModel, TitleSlugDescriptionModel
from django_fsm import FSMField, transition

from lxml import etree
from softdelete.models import SoftDeleteObject

from . import constants, managers
from ..pages.models import PageTemplate
from ..pages.constants import PageState
from ..users import constants as users_constants
from ..utils.models import file_upload_path
from ..utils.services import s3


class Project(SoftDeleteObject, TitleSlugDescriptionModel, TimeStampedModel):
    status = FSMField(choices=constants.PROJECT_STATUS_CHOICES, default=constants.ProjectStatus.IN_PROGRESS)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="projects", null=True
    )
    editors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_projects", blank=True)
    domain = models.URLField(blank=True, default="")
    xml_file = models.FileField(
        null=True, upload_to=file_upload_path, validators=[FileExtensionValidator(allowed_extensions=["xml"])]
    )

    objects = managers.ProjectManager()

    class Meta:
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")

    def __str__(self):
        return self.title

    def natural_key(self):
        return (self.title,)

    def relative_path_to_save(self, filename):
        base_path = self.xml_file.storage.location
        if not self.id:
            raise ValueError("Project is not set")
        return os.path.join(base_path, f"/rss/{self.id}/{filename}")

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
            "blocks": self.blocktemplate_set.count(),
            "pages": PageTemplate.objects.filter(project=self).count(),
            "tags": self.tags_categories.count(),
            "states": 0,
        }

    @functional.cached_property
    def project_info(self):
        return {"id": self.id, "title": self.title, "domain": self.domain}

    @transition(
        field=status, source=constants.ProjectStatus.IN_PROGRESS, target=constants.ProjectStatus.PUBLISHED
    )
    def publish(self):
        pass

    @transition(
        field=status, source=constants.ProjectStatus.PUBLISHED, target=constants.ProjectStatus.IN_PROGRESS
    )
    def in_progress(self):
        pass

    def create_xml_file(self):
        feed = etree.Element("rss", **{"version": "2.0"})
        channel = etree.Element("channel")
        etree.SubElement(channel, "title").text = self.title
        etree.SubElement(channel, "link").text = self.domain
        etree.SubElement(channel, "description").text = self.description

        pages = self.page_set.filter(
            is_public=True,
            section__is_public=True,
            section__is_rss_content=True,
            is_draft=False,
            state__in=[PageState.PUBLISHED, PageState.WAITING_TO_REPUBLISH],
        ).order_by("-publish_date")

        for page in pages:
            channel.append(page.create_xml_item())

        feed.append(channel)

        xml_file_in_bytes = BytesIO(etree.tostring(feed))

        key = f"rss/{self.id}/{self.title.lower().replace(' ', '-')}-rss.xml"

        s3.put_object(
            Body=xml_file_in_bytes,
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=key,
            ACL="public-read",
            ContentType="application/rss+xml",
        )

        self.xml_file = key

        return self.save(update_fields=["xml_file"])
