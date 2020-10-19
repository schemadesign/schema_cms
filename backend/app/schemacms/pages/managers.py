import softdelete.models
from django.db import models

from ..utils.managers import generate_soft_delete_manager


class PageManager(softdelete.models.SoftDeleteManager):
    def get_by_natural_key(self, project_title, name, is_template, is_draft):
        return self.get(project__title=project_title, name=name, is_template=is_template, is_draft=is_draft)


class PageOnlyTemplateManager(softdelete.models.SoftDeleteManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_template=True)


class PageOnlyManager(softdelete.models.SoftDeleteManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_template=False)


class PageBlockQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(
        self, project_title, block_name, name, order, is_draft=None, is_template=None, is_page=False
    ):
        if is_page:
            return self.get(
                page__project__title=project_title,
                page__name=block_name,
                name=name,
                order=order,
                page__is_draft=is_draft,
                page__is_template=is_template,
            )
        return self.get(block__project__title=project_title, block__name=block_name, name=name, order=order)


class PageBlockElementManager(softdelete.models.SoftDeleteManager):
    def get_by_natural_key(
        self,
        name,
        order,
        set_,
        parent,
        project_title,
        parent_name,
        block_name,
        block_order,
        is_draft=None,
        is_template=None,
        is_page=False,
    ):
        if is_page:
            return self.get(
                block__page__project__title=project_title,
                block__page__name=parent_name,
                block__name=block_name,
                block__order=block_order,
                block__page__is_draft=is_draft,
                block__page__is_template=is_template,
                name=name,
                order=order,
                parent=parent,
                custom_element_set=set_,
            )
        return self.get(
            block__block__project__title=project_title, block__block__name=block_name, name=name, order=order
        )


class SectionQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, name):
        return self.get(project__title=project_title, name=name)

    def annotate_pages_count(self):
        return self.annotate(
            pages_count=models.Count(
                "pages",
                filter=models.Q(
                    pages__deleted_at__isnull=True, pages__is_template=False, pages__is_draft=True
                ),
                distinct=True,
            )
        )


class PageTagManager(softdelete.models.SoftDeleteManager):
    def get_by_natural_key(self, project_title, page_name, is_template, is_draft, category_name, value):
        return self.get(
            page__project__title=project_title,
            page__name=page_name,
            page__is_template=is_template,
            page__is_draft=is_draft,
            category__name=category_name,
            value=value,
        )


class CustomElementManager(softdelete.models.SoftDeleteManager):
    def get_by_natural_key(self, id_, order):
        return self.get(id=id_, order=order)


class BlockTemplateQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, name):
        return self.get(project__title=project_title, name=name)


class BlockTemplateElementQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, template_name, name, order):
        return self.get(
            template__project__title=project_title, template__name=template_name, name=name, order=order
        )


SectionManager = generate_soft_delete_manager(queryset_class=SectionQuerySet)
BlockTemplateManager = generate_soft_delete_manager(queryset_class=BlockTemplateQuerySet)
BlockTemplateElementManager = generate_soft_delete_manager(queryset_class=BlockTemplateElementQuerySet)
PageBlockManager = generate_soft_delete_manager(queryset_class=PageBlockQuerySet)
