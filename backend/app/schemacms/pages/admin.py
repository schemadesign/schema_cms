from django.contrib import admin

from . import models
from ..utils.admin import SoftDeleteObjectAdmin


class ElementInline(admin.TabularInline):
    model = models.BlockElement
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.Block)
class BlockAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "is_template", "deleted_at")
    fields = ("project", "name", "is_template", "deleted_at")
    list_filter = ("project", "is_template", "deleted_at")
    readonly_on_update_fields = ("project",)
    inlines = (ElementInline,)


@admin.register(models.Page)
class PageAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "is_template", "deleted_at")
    fields = ("project", "name", "is_template", "deleted_at")
    list_filter = ("project", "is_template", "deleted_at")
    readonly_on_update_fields = ("project",)
