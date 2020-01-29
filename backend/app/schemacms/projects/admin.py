from django.contrib import admin
from django.db import transaction
from django.utils import safestring
from django.template.loader import render_to_string

from schemacms.utils import admin as utils_admin
from ..users.models import User
from . import models, forms


def update_meta_file(modeladmin, request, queryset):
    for obj in queryset.iterator():
        obj.create_dynamo_item()


def update_meta(modeladmin, request, queryset):
    for obj in queryset.iterator():
        obj.schedule_update_meta(copy_steps=False)


@admin.register(models.WranglingScript)
class WranglingScriptAdmin(utils_admin.SoftDeleteObjectAdmin):
    readonly_fields = ("specs",)
    readonly_on_update_fields = ("datasource",)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="Script", parent="datasource"
        )


@admin.register(models.Filter)
class FilterAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("name", "datasource", "deleted_at")
    fields = ("datasource", "name", "filter_type", "field", "field_type", "deleted")
    readonly_on_update_fields = ("datsource",)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="Filter", parent="datasource"
        )


@admin.register(models.Project)
class ProjectAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    fields = ("title", "description", "owner", "editors", "deleted")
    filter_horizontal = ("editors",)

    def delete_selected(self, request, queryset):
        return super().delete_queryset(request, queryset.exclude(deleted_at__isnull=0))

    delete_selected.short_description = 'Soft delete selected objects'

    def soft_undelete(self, request, queryset):
        return self.handle_unique_conflicts_on_undelete(
            request, queryset, field="title", model_name="Project"
        )

    soft_undelete.short_description = 'Undelete selected objects'

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['editors'].queryset = User.objects.filter(role="editor")
        return form

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner").prefetch_related("editors")

    def get_editors(self, obj):
        # to reduce db calls use prefetch related cache
        emails = (editor.email for editor in obj.editors.all())
        html = render_to_string("common/unordered_list.html", context=dict(objects=emails))
        return safestring.mark_safe(html)

    get_editors.short_description = "Editors"


@admin.register(models.DataSource)
class DataSourceAdmin(utils_admin.SoftDeleteObjectAdmin):
    actions = utils_admin.SoftDeleteObjectAdmin.actions + [update_meta_file, update_meta]
    list_display = ("name", "project", "deleted_at")
    fields = ("project", "name", "created_by", "type", "file", "active_job", "deleted")
    list_filter = ('project', "type", "deleted_at")
    readonly_on_update_fields = ("project",)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="DataSource", parent="project"
        )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['active_job'].queryset = models.DataSourceJob.objects.filter(datasource=obj)
        return form

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("active_job", "project", "created_by")

    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        if 'file' in form.changed_data and obj.file:
            file = obj.file
            obj.file = None
            super().save_model(request, obj, form, change)
            obj.file.save(file.name, file)
        else:
            super().save_model(request, obj, form, change)

        models.DataSourceMeta.objects.update_or_create(datasource=obj, defaults={"datasource": obj})


class DataSourceJobStepInline(admin.TabularInline):
    model = models.DataSourceJobStep
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.DataSourceJob)
class DataSourceJobAdmin(utils_admin.SoftDeleteObjectAdmin):
    actions = utils_admin.SoftDeleteObjectAdmin.actions + [update_meta]
    list_display = ('pk', 'datasource', 'job_state', 'created', 'deleted_at')
    fields = ("datasource", "job_state", "description", "result", "error", "deleted")
    readonly_on_update_fields = ("datasource",)
    list_filter = ('datasource',)
    inlines = [DataSourceJobStepInline]


@admin.register(models.Folder)
class FolderAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ('id', 'name', 'project', 'deleted_at')
    fields = ("project", "name", "created_by", "deleted")
    readonly_on_update_fields = ("project",)
    search_fields = ('name',)
    list_filter = ('project',)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="Folder", parent="project"
        )


@admin.register(models.Page)
class PageAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ('id', 'title', 'folder', 'project', 'deleted_at')
    fields = ("folder", "title", "created_by", "description", "keywords", "deleted")
    readonly_on_update_fields = ("folder",)

    search_fields = ('title',)
    list_filter = ('folder',)

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
    list_display = ('id', 'name', 'page_title', 'folder', 'project', 'deleted_at')
    fields = ("page", "name", "type", "content", "is_active", "deleted")
    readonly_on_update_fields = ("page",)
    search_fields = ('name',)
    list_filter = ('page',)
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


class TagInline(admin.TabularInline):
    model = models.Tag
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.TagsList)
class TagAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("name", "datasource", "deleted_at")
    fields = ("datasource", "name", "deleted")
    list_filter = ('datasource', "deleted_at")
    readonly_on_update_fields = ("tags_list",)
    inlines = (TagInline,)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="TagsList", parent="datasource"
        )
