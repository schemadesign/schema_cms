from django.contrib import admin

from . import models
from ..utils.admin import SoftDeleteObjectAdmin


@admin.register(models.Tag)
class TagAdmin(SoftDeleteObjectAdmin):
    list_display = ("category", "value", "deleted_at")
    fields = ("category", "value", "deleted_at")
    list_filter = ("category", "deleted_at")


class TagTabularInline(admin.TabularInline):
    model = models.Tag
    extra = 0
    readonly_fields = ("deleted_at",)

    def get_max_num(self, request, obj=None, **kwargs):
        if obj and obj.deleted:
            return 0
        return self.min_num

    def get_queryset(self, request):
        qs = self.model._default_manager.all_with_deleted()
        ordering = self.get_ordering(request) or ()
        if ordering:
            qs = qs.order_by(*ordering)
        return qs

    queryset = get_queryset


@admin.register(models.TagCategory)
class TagCategoryAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "is_single_select", "deleted_at")
    list_filter = ("project", "deleted_at")
    inlines = [TagTabularInline]
