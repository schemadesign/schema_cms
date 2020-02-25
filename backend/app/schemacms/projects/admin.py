from django.contrib import admin
from django.template.loader import render_to_string
from django.utils import safestring

from . import models, forms
from ..users.models import User
from ..utils import admin as utils_admin


@admin.register(models.Project)
class ProjectAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    fields = ("title", "description", "owner", "editors", "deleted_at")
    filter_horizontal = ("editors",)

    def delete_selected(self, request, queryset):
        return super().delete_queryset(request, queryset.exclude(deleted_at__isnull=0))

    delete_selected.short_description = "Soft delete selected objects"

    def soft_undelete(self, request, queryset):
        return self.handle_unique_conflicts_on_undelete(
            request, queryset, field="title", model_name="Project"
        )

    soft_undelete.short_description = "Undelete selected objects"

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["editors"].queryset = User.objects.filter(role="editor")
        return form

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner").prefetch_related("editors")

    def get_editors(self, obj):
        # to reduce db calls use prefetch related cache
        emails = (editor.email for editor in obj.editors.all())
        html = render_to_string("common/unordered_list.html", context=dict(objects=emails))
        return safestring.mark_safe(html)

    get_editors.short_description = "Editors"


@admin.register(models.Folder)
class FolderAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("id", "name", "project", "deleted_at")
    fields = ("project", "name", "created_by", "deleted_at")
    readonly_on_update_fields = ("project",)
    search_fields = ("name",)
    list_filter = ("project",)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="Folder", parent="project"
        )


@admin.register(models.Page)
class PageAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("id", "title", "folder", "project", "deleted_at")
    fields = ("folder", "title", "created_by", "description", "keywords", "deleted_at")
    readonly_on_update_fields = ("folder",)

    search_fields = ("title",)
    list_filter = ("folder",)

    def project(self, obj):
        return obj.folder.project.title

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="title", model_name="Page", parent="folder"
        )


class BlockImageInline(admin.TabularInline):
    model = models.BlockImage
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.Block)
class BlockAdmin(utils_admin.SoftDeleteObjectAdmin):
    form = forms.BlockForm
    list_display = ("id", "name", "page_title", "folder", "project", "deleted_at")
    fields = ("page", "name", "type", "content", "is_active", "deleted_at")
    readonly_on_update_fields = ("page",)
    search_fields = ("name",)
    list_filter = ("page",)
    inlines = (BlockImageInline,)

    def page_title(self, obj):
        return f"{obj.page.title}"

    def folder(self, obj):
        return obj.page.folder.name

    def project(self, obj):
        return obj.page.folder.project.title

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="Block", parent="page"
        )
