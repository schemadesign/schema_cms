from django.contrib import admin
from django.db import transaction

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


@admin.register(models.PageTemplate)
class PageTemplateAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at", "is_template")
    fields = ("project", "name", "deleted_at")
    list_filter = ("project", "deleted_at")
    readonly_on_update_fields = ("project",)
    inlines = (BlockInline,)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="PageTemplate", parent="project"
        )

    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_template=True)

    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        obj.is_template = True
        super().save_model(request, obj, form, change)


@admin.register(models.Section)
class SectionAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "deleted_at")
    list_filter = ("project", "deleted_at")
    readonly_on_update_fields = ("project",)


@admin.register(models.Page)
class PageAdmin(SoftDeleteObjectAdmin):
    list_display = ("name", "section", "project", "deleted_at", "is_template")
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

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="Page", parent="section"
        )

    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_template=False)

    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        obj.is_template = False
        super().save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj:
            form.base_fields["template"].queryset = models.PageTemplate.objects.filter(project=obj.project)
            form.base_fields["section"].queryset = models.Section.objects.filter(project=obj.project)
        return form
