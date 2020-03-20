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


class BlockInline(admin.TabularInline):
    model = models.Page.blocks.through
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.PageTemplate)
class PageTemplateAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "deleted_at")
    list_filter = ("project", "deleted_at")
    readonly_on_update_fields = ("project",)
    inlines = (BlockInline,)


@admin.register(models.Section)
class SectionAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "deleted_at")
    list_filter = ("project", "deleted_at")
    readonly_on_update_fields = ("project",)


@admin.register(models.Page)
class PageAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "section", "project", "deleted_at")
    fields = (
        "project",
        "section",
        "template",
        "name",
        "display_name",
        "description",
        "keywords",
        "is_public",
        "deleted_at",
    )
    list_filter = ("project", "section", "deleted_at")
    readonly_on_update_fields = ("project",)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["template"].queryset = models.PageTemplate.objects.filter(project=obj.project)
        form.base_fields["section"].queryset = models.Section.objects.filter(project=obj.project)
        return form
