from django.contrib import admin

from . import models
from ..utils.admin import SoftDeleteObjectAdmin


class ElementInline(admin.TabularInline):
    model = models.BlockTemplateElement
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.BlockTemplate)
class BlockTemplateAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "deleted_at")
    list_filter = ("project", "deleted_at")
    readonly_on_update_fields = ("project",)
    inlines = (ElementInline,)


@admin.register(models.PageTemplate)
class PageTemplateAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "blocks", "deleted_at")
    list_filter = ("project", "deleted_at")
    readonly_on_update_fields = ("project",)
