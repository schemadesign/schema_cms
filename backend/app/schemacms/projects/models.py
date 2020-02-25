import itertools
import os

import django_fsm
import softdelete.models
from django.conf import settings
from django.db import models
from django.utils import functional
from django.utils.translation import ugettext as _
from django_extensions.db import models as ext_models

from . import constants, managers
from ..users import constants as users_constants
from ..utils.models import file_upload_path, MetaGeneratorMixin


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
        return self.folders.values("pages").count()

    @functional.cached_property
    def users_count(self):
        return self.editors.all().count()

    @functional.cached_property
    def charts_count(self):
        return 0  # just for mock purposes till charts will be implemented

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

        if self.folders:
            pages = [d.meta_file_serialization() for d in self.folders.all()]
            data.update({"pages": list(itertools.chain.from_iterable(pages))})

        return data


# Pages


class Folder(MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    project: Project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="folders")
    name = models.CharField(max_length=constants.DIRECTORY_NAME_MAX_LENGTH)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="folders", null=True
    )

    def __str__(self):
        return self.name or str(self.pk)

    class Meta:
        verbose_name = _("Folder")
        verbose_name_plural = _("Folders")
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name"], name="unique_project_folder", condition=models.Q(deleted_at=None)
            )
        ]
        ordering = ("name",)

    def get_project(self):
        return self.project

    @functional.cached_property
    def project_info(self):
        return dict(id=self.project.id, title=self.project.title)

    def meta_file_serialization(self):
        data = []

        for page in self.pages.all():
            page_dict = {
                "id": page.id,
                "title": page.title,
                "description": page.description or None,
                "folder": self.name,
            }
            data.append(page_dict)

        return data


class Page(
    MetaGeneratorMixin,
    ext_models.TitleSlugDescriptionModel,
    softdelete.models.SoftDeleteObject,
    ext_models.TimeStampedModel,
):
    folder: Folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="pages")
    keywords = models.TextField(blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="pages", null=True
    )

    objects = managers.PageManager()

    def __str__(self):
        return f"{self.title or str(self.pk)}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["folder", "title"], name="unique_folder_page", condition=models.Q(deleted_at=None)
            )
        ]
        ordering = ("created",)

    @property
    def page_url(self):
        return os.path.join(
            settings.PUBLIC_API_LAMBDA_URL, "projects", str(self.folder.project_id), "pages", str(self.pk)
        )

    @property
    def dynamo_table_name(self):
        return "pages"

    @functional.cached_property
    def blocks_count(self):
        return self.blocks.count()

    @functional.cached_property
    def project_info(self):
        project = self.folder.project
        return dict(id=project.id, title=project.title)

    def get_project(self):
        return self.folder.project

    def get_blocks(self):
        blocks = []

        for block in self.blocks.filter(is_active=True):
            data = {
                "id": block.id,
                "name": block.name,
                "type": block.type or None,
                "content": block.content or None,
                "exec_order": block.exec_order or None,
                "images": block.get_images(),
            }
            blocks.append(data)

        return blocks

    def meta_file_serialization(self):
        page_info = {
            "id": self.id,
            "title": self.title,
            "description": self.description or None,
            "keywords": self.keywords or None,
            "folder": self.folder.name,
            "updated": str(self.modified),
            "creator": None if not self.created_by else self.created_by.get_full_name(),
            "blocks": self.get_blocks(),
        }

        return page_info


class Block(MetaGeneratorMixin, softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    page: Page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="blocks")
    name = models.CharField(max_length=constants.BLOCK_NAME_MAX_LENGTH)
    type = models.CharField(max_length=25, choices=constants.BLOCK_TYPE_CHOICES)
    content = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    exec_order = models.IntegerField(null=True, default=None)

    def __str__(self):
        return self.name or str(self.pk)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["page", "name"], name="unique_page_block", condition=models.Q(deleted_at=None)
            )
        ]
        ordering = ("created",)

    def get_project(self):
        return self.page.folder.project

    def get_images(self):
        if not hasattr(self, "images"):
            return []
        return [{"url": i.image.url, "order": i.exec_order, "name": i.image_name} for i in self.images.all()]

    @functional.cached_property
    def project_info(self):
        project = self.page.folder.project
        return dict(id=project.id, title=project.title)


class BlockImage(softdelete.models.SoftDeleteObject, ext_models.TimeStampedModel):
    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to=file_upload_path, null=True, blank=True)
    image_name = models.CharField(max_length=255, blank=True)
    exec_order = models.IntegerField(default=0)

    class Meta:
        ordering = ("created",)

    def relative_path_to_save(self, filename):
        base_path = self.image.storage.location

        if not self.block.page_id:
            raise ValueError("Page is not set")

        return os.path.join(base_path, f"pages/{self.block.page_id}/{filename}")

    def get_original_image_name(self, file_name=None):
        if not file_name:
            file_name = self.image.name

        name, ext = os.path.splitext(os.path.basename(file_name))

        return name, os.path.basename(file_name)
