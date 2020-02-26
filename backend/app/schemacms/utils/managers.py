import softdelete.models


def generate_soft_delete_manager(queryset_class):
    class _soft_delete_manager_class(softdelete.models.SoftDeleteManager):
        def get_query_set(self):
            qs = super().get_query_set()
            qs.__class__ = queryset_class
            return qs

        def get_queryset(self):
            qs = super().get_queryset()
            qs.__class__ = queryset_class
            return qs

        def all_with_deleted(self, prt=False):
            qs = super().all_with_deleted(prt)
            qs.__class__ = queryset_class
            return qs

        def deleted_set(self):
            qs = super().deleted_set()
            qs.__class__ = queryset_class
            return qs

        def filter(self, *args, **kwargs):
            qs = super().filter(*args, **kwargs)
            qs.__class__ = queryset_class
            return qs

    return _soft_delete_manager_class
