import softdelete.models

from ..utils.managers import generate_soft_delete_manager


class TagCategoryQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, name):
        return self.get(project__title=project_title, name=name)


class TagQuerySet(softdelete.models.SoftDeleteQuerySet):
    def get_by_natural_key(self, project_title, category_name, value):
        return self.get(category__project__title=project_title, category__name=category_name, value=value)


TagCategoryManager = generate_soft_delete_manager(queryset_class=TagCategoryQuerySet)
TagManager = generate_soft_delete_manager(queryset_class=TagQuerySet)
