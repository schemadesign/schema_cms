import os

from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models
from django.utils import functional
from django_extensions.db.models import AutoSlugField, TimeStampedModel
from softdelete.models import SoftDeleteObject
from storages.backends.s3boto3 import S3Boto3Storage

from . import constants, managers
from ..utils.models import file_upload_path


class Element(SoftDeleteObject, models.Model):
    name = models.CharField(max_length=constants.ELEMENT_NAME_MAX_LENGTH)
    type = models.CharField(max_length=25, choices=constants.ELEMENT_TYPE_CHOICES)
    order = models.PositiveIntegerField(default=0)
    params = pg_fields.JSONField(default=dict, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"


class Content(SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    name = models.CharField(max_length=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_template = models.BooleanField(default=True)
    is_available = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"

    @functional.cached_property
    def project_info(self):
        return self.project.project_info


class Block(Content):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name", "is_template"],
                name="unique_block_name",
                condition=models.Q(deleted_at=None),
            )
        ]

    def delete_elements(self, elements):
        self.elements.filter(id__in=elements).delete()


class BlockElement(Element):
    template = models.ForeignKey(Block, on_delete=models.CASCADE, related_name="elements")


class Section(SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="sections")
    name = models.CharField(max_length=constants.SECTION_NAME_MAX_LENGTH)
    slug = AutoSlugField(populate_from="name", allow_duplicates=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_public = models.BooleanField(default=False)
    main_page = models.OneToOneField(
        "pages.Page", on_delete=models.SET_NULL, null=True, related_name="main_page"
    )

    objects = managers.SectionManager()

    def __str__(self):
        return f"{self.name}"

    @functional.cached_property
    def project_info(self):
        return self.project.project_info

    @functional.cached_property
    def pages_count(self):
        return self.pages.count()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name"], name="unique_section_name", condition=models.Q(deleted_at=None),
            )
        ]


class Page(Content):
    section = models.ForeignKey("Section", on_delete=models.CASCADE, null=True, related_name="pages")
    template = models.ForeignKey("PageTemplate", on_delete=models.SET_NULL, null=True)
    display_name = models.CharField(max_length=constants.PAGE_DISPLAY_NAME_MAX_LENGTH, blank=True, default="")
    description = models.TextField(blank=True, default="")
    keywords = models.TextField(blank=True, default="")
    slug = AutoSlugField(populate_from="name", allow_duplicates=True)
    is_public = models.BooleanField(default=False)
    allow_edit = models.BooleanField(default=False)
    blocks = models.ManyToManyField(Block, through="PageBlock")

    objects = managers.PageManager()

    class Meta:
        ordering = ("-created",)

    def create_or_update_block(self, block):
        return self.pageblock_set.update_or_create(id=block.get("id", None), defaults={"page": self, **block})

    def delete_blocks(self, blocks: list):
        self.pageblock_set.filter(id__in=blocks).delete()


class PageTemplate(Page):
    objects = managers.PageTemplateManager()

    class Meta:
        proxy = True


class PageBlock(SoftDeleteObject):
    block = models.ForeignKey("Block", on_delete=models.CASCADE)
    page = models.ForeignKey("Page", on_delete=models.CASCADE)
    name = models.CharField(max_length=constants.TEMPLATE_NAME_MAX_LENGTH)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name}"


class PageBlockElement(Element):
    block = models.ForeignKey(PageBlock, on_delete=models.CASCADE, related_name="elements")
    markdown = models.TextField(blank=True, default="")
    connection = models.URLField(blank=True, default="", max_length=1000)
    internal_connection = models.TextField(blank=True, default="", max_length=1000)
    plain_text = models.TextField(blank=True, default="", max_length=1000)
    code = models.TextField(blank=True, default="", max_length=1000)
    image = models.ImageField(
        null=True,
        storage=S3Boto3Storage(bucket=settings.AWS_STORAGE_PAGES_BUCKET_NAME),
        upload_to=file_upload_path,
    )
    custom_element = models.ForeignKey(
        "PageBlockElement", on_delete=models.CASCADE, related_name="elements", null=True
    )

    def relative_path_to_save(self, filename):
        base_path = self.image.storage.location

        if not self.block_id:
            raise ValueError("Page is not set")

        return os.path.join(base_path, f"{self.block.page_id}/blocks/{self.block_id}/{filename}")

    def update_or_create_custom_elements(self, elements):
        for element in elements:
            type_ = element.get("type")
            element[type_] = element.pop("value")

            if "key" in element:
                element.pop("key")

            element, _ = PageBlockElement.objects.update_or_create(
                id=element.pop("id", None), defaults=dict(block=self.block, custom_element=self, **element),
            )
