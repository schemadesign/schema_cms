import os

from lxml import etree

from django.conf import settings
from django.contrib.postgres import fields as pg_fields
from django.db import models, transaction
from django.utils import functional, timezone
from django_extensions.db.models import AutoSlugField, TimeStampedModel
from django_fsm import FSMField, transition
from model_clone import CloneMixin
from softdelete.models import SoftDeleteObject
from storages.backends.s3boto3 import S3Boto3Storage

from . import constants, managers
from ..utils.models import file_upload_path


class Element(CloneMixin, SoftDeleteObject):
    name = models.CharField(max_length=constants.ELEMENT_NAME_MAX_LENGTH, blank=True, default="")
    type = models.CharField(max_length=25, choices=constants.ELEMENT_TYPE_CHOICES)
    order = models.PositiveIntegerField(default=0)
    params = pg_fields.JSONField(default=dict, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"


class Content(CloneMixin, SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    name = models.CharField(max_length=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_available = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"

    @functional.cached_property
    def project_info(self):
        return self.project.project_info


class BlockTemplate(Content):
    _clone_many_to_one_or_one_to_many_fields = ["elements", "project", "created_by"]

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name"],
                name="unique_block_template_name",
                condition=models.Q(deleted_at=None),
            )
        ]

    def delete_elements(self, elements):
        self.elements.filter(id__in=elements).delete()


class BlockTemplateElement(Element):
    template = models.ForeignKey(BlockTemplate, on_delete=models.CASCADE, related_name="elements")

    _clone_many_to_one_or_one_to_many_fields = ["template"]


class Section(SoftDeleteObject, TimeStampedModel):
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE, related_name="sections")
    name = models.CharField(max_length=constants.SECTION_NAME_MAX_LENGTH)
    slug = AutoSlugField(populate_from="name", allow_duplicates=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_public = models.BooleanField(default=True)
    is_rss_content = models.BooleanField(default=False)
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
    section = models.ForeignKey(
        "Section", on_delete=models.CASCADE, null=True, blank=True, related_name="pages"
    )
    template = models.ForeignKey("PageTemplate", on_delete=models.SET_NULL, null=True, blank=True)
    display_name = models.CharField(max_length=constants.PAGE_DISPLAY_NAME_MAX_LENGTH, blank=True, default="")
    description = models.TextField(blank=True, default="")
    keywords = models.TextField(blank=True, default="")
    slug = AutoSlugField(populate_from="name", allow_duplicates=True)
    is_public = models.BooleanField(default=True)
    allow_edit = models.BooleanField(default=False)
    blocks = models.ManyToManyField(BlockTemplate, through="PageBlock")
    is_template = models.BooleanField(default=True)
    is_draft = models.BooleanField(default=True, editable=False, db_index=True)
    published_version = models.OneToOneField(
        "self", on_delete=models.SET_NULL, related_name="draft_version", null=True, editable=False,
    )
    state = FSMField(choices=constants.PAGE_STATE_CHOICES, default=constants.PageState.DRAFT)
    link = models.URLField(blank=True, default="")

    objects = managers.PageManager()

    _clone_many_to_one_or_one_to_many_fields = ["tags"]

    class Meta:
        ordering = ("-created",)

    @property
    def is_published(self):
        published_states = [constants.PageState.PUBLISHED, constants.PageState.WAITING_TO_REPUBLISH]
        if self.is_draft:
            return self.published_version.state in published_states
        else:
            return self.state in published_states

    def create_or_update_block(self, block):
        return PageBlock.objects.update_or_create(id=block.get("id", None), defaults={"page": self, **block})

    def delete_blocks(self, blocks: list = None):
        if not blocks:
            self.page_blocks.all().delete()
        else:
            self.page_blocks.filter(id__in=blocks).delete()

    def add_tags(self, tags_list):
        self.tags.all().delete()

        for tag in tags_list:
            PageTag.objects.create(page=self, category_id=tag["category"], value=tag["value"])

    @transition(field=state, source="*", target=constants.PageState.PUBLISHED)
    def publish(self):
        draft: Page = self.draft_version

        self.name = draft.name
        self.section = draft.section
        self.template = draft.template
        self.display_name = draft.display_name
        self.description = draft.description
        self.keywords = draft.keywords
        self.slug = draft.slug
        self.is_public = draft.is_public
        self.allow_edit = draft.allow_edit
        self.link = draft.link
        self.modified = timezone.now()

        self.delete_blocks()
        self.tags.all().delete()

        for block in draft.page_blocks.all():
            c_block = block.make_clone(attrs={"page": self})

            for element in block.elements.all():
                element.clone(c_block)

        for tag in draft.tags.all():
            tag.make_clone(attrs={"page": self})

    @transition(
        field=state, source=constants.PageState.PUBLISHED, target=constants.PageState.WAITING_TO_REPUBLISH
    )
    def wait_to_republish(self):
        pass

    @transaction.atomic()
    def copy_page(self, attrs: dict = None):

        copy_time = timezone.now().strftime("%Y-%m-%d, %H:%M:%S.%f")

        if not attrs:
            attrs = {"name": f"Page ID #{self.id} copy({copy_time})"}

        new_page = self.make_clone(attrs=attrs)

        for block in self.page_blocks.all():
            c_block = block.make_clone(attrs={"page": new_page})

            for element in block.elements.all():
                element.clone(c_block)

        return new_page

    def create_xml_item(self):
        item = etree.Element("item")
        etree.SubElement(item, "title").text = self.name
        etree.SubElement(item, "link").text = self.link
        etree.SubElement(item, "description").text = self.description

        ctime = self.modified.ctime()
        pub_date = f"{ctime[0:3]}, {self.modified.day:02d} {ctime[4:7]}" + self.modified.strftime(
            " %Y %H:%M:%S %z"
        )
        etree.SubElement(item, "pubDate").text = pub_date

        return item


class PageTemplate(Page):
    objects = managers.PageTemplateManager()

    class Meta:
        proxy = True

    @transaction.atomic()
    def copy_template(self):

        copy_time = timezone.now().strftime("%Y-%m-%d, %H:%M:%S.%f")
        new_page = self.make_clone(attrs={"name": f"Page Template ID #{self.id} copy({copy_time})"})

        for block in self.page_blocks.all():
            block.make_clone(attrs={"page": new_page})

        return new_page


class PageBlock(CloneMixin, SoftDeleteObject):
    block = models.ForeignKey("BlockTemplate", on_delete=models.CASCADE, null=True)
    page = models.ForeignKey("Page", on_delete=models.CASCADE, related_name="page_blocks")
    name = models.CharField(max_length=constants.TEMPLATE_NAME_MAX_LENGTH, blank=True, default="")
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
    embed_video = models.TextField(blank=True, default="", max_length=1000)
    file = models.FileField(
        null=True,
        storage=S3Boto3Storage(bucket=settings.AWS_STORAGE_PAGES_BUCKET_NAME),
        upload_to=file_upload_path,
    )
    image = models.ImageField(
        null=True,
        storage=S3Boto3Storage(bucket=settings.AWS_STORAGE_PAGES_BUCKET_NAME),
        upload_to=file_upload_path,
    )
    custom_element_set = models.ForeignKey(
        "CustomElementSet", on_delete=models.CASCADE, related_name="elements", null=True
    )
    observable_hq = models.OneToOneField("PageBlockObservableElement", on_delete=models.CASCADE, null=True)
    state = models.ForeignKey("states.State", null=True, related_name="elements", on_delete=models.SET_NULL)

    _clone_one_to_one_fields = ["observable_hq"]

    def relative_path_to_save(self, filename):
        base_path = self.image.storage.location

        if not self.block_id:
            raise ValueError("Page is not set")

        return os.path.join(base_path, f"{self.block.page_id}/blocks/{self.block_id}/{filename}")

    def get_original_file_name(self, file_name=None, image=True):
        if not file_name:
            file_name = self.image.name if image else self.file.name
        name, ext = os.path.splitext(os.path.basename(file_name))
        return name, os.path.basename(file_name)

    def update_or_create_custom_element_sets(self, elements_sets_list):
        for elements_set in elements_sets_list:
            element_set_order = elements_set.get("order")

            custom_element_set, _ = CustomElementSet.objects.update_or_create(
                id=elements_set.pop("id", None), defaults=dict(custom_element=self, order=element_set_order),
            )

            set_elements = elements_set.get("elements", [])

            self.update_or_create_custom_element_set_elements(set_elements, custom_element_set)

    def update_or_create_custom_element_set_elements(self, elements, custom_element_set):
        for element in elements:
            element_type = element.get("type")
            element_value = element.pop("value")

            if (
                element_type in [constants.ElementType.IMAGE, constants.ElementType.FILE]
                and element_value is not False
            ):
                element[element_type] = element_value

            if element_type in [
                constants.ElementType.MARKDOWN,
                constants.ElementType.PLAIN_TEXT,
                constants.ElementType.CODE,
                constants.ElementType.INTERNAL_CONNECTION,
                constants.ElementType.CONNECTION,
                constants.ElementType.EMBED_VIDEO,
                constants.ElementType.STATE,
            ]:
                element[element_type] = element_value

            element, _ = PageBlockElement.objects.update_or_create(
                id=element.pop("id", None),
                defaults=dict(block=self.block, custom_element_set=custom_element_set, **element),
            )

            if element_type == constants.ElementType.OBSERVABLE_HQ:
                self.create_update_observable_element(element_value, element)

    def delete_custom_elements_sets(self, ids_to_delete):
        self.elements_sets.filter(id__in=ids_to_delete).delete()

    def create_update_observable_element(self, value, element=None):
        element_instance = element if element else self

        hq_element, is_create = PageBlockObservableElement.objects.update_or_create(
            id=value.pop("id", None), defaults=dict(**value)
        )

        if is_create:
            element_instance.observable_hq = hq_element
            element_instance.save(update_fields=["observable_hq"])

    def clone(self, block=None):
        block = block if block else self.block
        if self.custom_element_set:
            return None

        if self.type == constants.ElementType.OBSERVABLE_HQ:
            return self.clone_observable_element(block)

        elif self.type == constants.ElementType.CUSTOM_ELEMENT:
            return self.clone_custom_element(block)
        else:
            return self.clone_simple_element(block)

    def clone_simple_element(self, block=None, elements_set=None):

        attrs = {"block": block}

        if elements_set:
            attrs["custom_element_set"] = elements_set

        return self.make_clone(attrs=attrs)

    def clone_observable_element(self, block=None, elements_set=None):
        new_obs = self.observable_hq.make_clone()

        attrs = {"block": block, "observable_hq": new_obs}

        if elements_set:
            attrs["custom_element_set"] = elements_set

        return self.make_clone(attrs=attrs)

    def clone_custom_element(self, block=None):
        block = block if block else self.block
        new_ele = self.make_clone(attrs={"block": block})

        for element_set in self.elements_sets.all():
            new_set = element_set.make_clone(attrs={"custom_element": new_ele})

            for set_element in element_set.elements.all():
                if set_element.type == constants.ElementType.OBSERVABLE_HQ:
                    set_element.clone_observable_element(block=block, elements_set=new_set)
                else:
                    set_element.clone_simple_element(block=block, elements_set=new_set)

        return new_ele


class CustomElementSet(CloneMixin, SoftDeleteObject):
    custom_element = models.ForeignKey(
        PageBlockElement, on_delete=models.CASCADE, related_name="elements_sets"
    )
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.id}"


class PageBlockObservableElement(CloneMixin, SoftDeleteObject):
    observable_user = models.TextField(blank=True, default="", max_length=1000)
    observable_notebook = models.TextField(blank=True, default="", max_length=1000)
    observable_cell = models.TextField(blank=True, default="", max_length=1000)
    observable_params = models.TextField(blank=True, default="", max_length=1000)

    def __str__(self):
        return f"{self.id}"

    def as_dict(self):
        return {
            "observable_user": self.observable_user,
            "observable_notebook": self.observable_notebook,
            "observable_cell": self.observable_cell,
            "observable_params": self.observable_params,
        }


class PageTag(CloneMixin, SoftDeleteObject):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="tags")
    category = models.ForeignKey("tags.TagCategory", on_delete=models.SET_NULL, null=True)
    value = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.id}"
