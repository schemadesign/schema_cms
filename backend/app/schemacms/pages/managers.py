import softdelete.models
from django.db import models

from ..utils.managers import generate_soft_delete_manager


class PageTemplateManager(softdelete.models.SoftDeleteManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_template=True)


class PageManager(softdelete.models.SoftDeleteManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_template=False)

    def get_by_natural_key(self, project_title, name, is_template, is_draft):
        return self.get(project__title=project_title, name=name, is_template=is_template, is_draft=is_draft)


class PageBlockQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, page_name, is_template, is_draft, name, order):
        return self.get(
            page__project__title=project_title,
            page__name=page_name,
            page__is_template=is_template,
            page__is_draft=is_draft,
            name=name,
            order=order,
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
