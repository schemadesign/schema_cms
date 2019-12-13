from django.contrib import admin
from django.db import transaction
from django.utils import safestring
from django.template.loader import render_to_string

from schemacms.utils import admin as utils_admin
from . import models, forms


def update_meta_file(modeladmin, request, queryset):
    for obj in queryset.iterator():
        obj.create_meta_file()


def update_meta(modeladmin, request, queryset):
    for obj in queryset.iterator():
        obj.update_meta()


@admin.register(models.WranglingScript)
class WranglingScript(utils_admin.SoftDeleteObjectAdmin):
    readonly_fields = ("specs",)

    def soft_undelete(self, request, queryset):
        self.handle_conflicts_on_undelate(request, queryset, field="name", model_name="Script")


@admin.register(models.Project)
class Project(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    filter_horizontal = ("editors",)

    def delete_selected(self, request, queryset):
        return super().delete_queryset(request, queryset.exclude(deleted_at__isnull=0))

    delete_selected.short_description = 'Soft delete selected objects'

    def soft_undelete(self, request, queryset):
        return self.handle_unique_conflicts_on_undelete(
            request, queryset, field="title", model_name="Project"
        )

    soft_undelete.short_description = 'Undelete selected objects'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner").prefetch_related("editors")

    def get_editors(self, obj):
        # to reduce db calls use prefetch related cache
        emails = (editor.email for editor in obj.editors.all())
        html = render_to_string("common/unordered_list.html", context=dict(objects=emails))
        return safestring.mark_safe(html)

    get_editors.short_description = "Editors"


@admin.register(models.DataSource)
class DataSource(utils_admin.SoftDeleteObjectAdmin):
    actions = utils_admin.SoftDeleteObjectAdmin.actions + [update_meta_file]
    list_display = ("name", "deleted_at")

    def soft_undelete(self, request, queryset):
        self.handle_conflicts_on_undelate(request, queryset, field="name", model_name="DataSource")

    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        if 'file' in form.changed_data and obj.file:
            file = obj.file
            obj.file = None
            super().save_model(request, obj, form, change)
            obj.file.save(file.name, file)
        else:
            super().save_model(request, obj, form, change)


class DataSourceJobStepInline(admin.TabularInline):
    model = models.DataSourceJobStep
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.DataSourceJob)
class DataSourceJobAdmin(utils_admin.SoftDeleteObjectAdmin):
    actions = utils_admin.SoftDeleteObjectAdmin.actions + [update_meta]
    list_display = ('pk', 'datasource', 'job_state', 'created', 'deleted_at')
    inlines = [DataSourceJobStepInline]


@admin.register(models.Folder)
class FolderAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ('id', 'name', 'project', 'deleted_at')
    search_fields = ('name',)
    list_filter = ('project',)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(request, queryset, field="name", model_name="Folder")


@admin.register(models.Page)
class PageAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ('id', 'title', 'folder', 'project', 'deleted_at')
    search_fields = ('title',)
    list_filter = ('folder',)

    def project(self, obj):
        return obj.folder.project.title

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(request, queryset, field="title", model_name="Page")


@admin.register(models.Block)
class BlockAdmin(utils_admin.SoftDeleteObjectAdmin):
    form = forms.BlockForm
    list_display = ('id', 'name', 'page', 'folder', 'project', 'deleted_at')
    search_fields = ('name',)
    list_filter = ('page',)

    def folder(self, obj):
        return obj.page.folder.name

    def project(self, obj):
        return obj.page.folder.project.title

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(request, queryset, field="name", model_name="Block")
