import itertools

from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.utils import safestring
from django.template.loader import render_to_string

from schemacms.utils import admin as utils_admin
from . import models, forms


admin.site.register(models.WranglingScript)


def update_meta_file(modeladmin, request, queryset):
    for obj in queryset.iterator():
        obj.create_meta_file()


def update_meta(modeladmin, request, queryset):
    for obj in queryset.iterator():
        obj.update_meta()


@admin.register(models.Project)
class Project(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    filter_horizontal = ("editors",)

    def delete_selected(self, request, queryset):
        return super().delete_queryset(request, queryset.exclude(deleted_at__isnull=0))

    delete_selected.short_description = 'Soft delete selected objects'

    def soft_undelete(self, request, queryset):
        queryset = queryset.filter(deleted_at__isnull=0)
        # Check if project names exist in the not deleted queryset
        field = "title"
        conflicts = (
            self.model.objects.values_list(field, flat=True)
            .filter(**{f"{field}__in": queryset.values(field)})
            .distinct(field)
            .iterator()
        )
        conflict = next(conflicts, None)
        if conflict:
            html = render_to_string(
                "common/unordered_list.html",
                context=dict(
                    objects=itertools.chain([conflict], conflicts),
                    li_style="background: transparent; padding: 0px;",
                ),
            )
            msg = safestring.mark_safe(
                f"Project(s) with name: {html} already exists. "
                f"Please change name of this project before undeleting it."
            )
            self.message_user(request=request, message=msg, level=messages.ERROR)
            return
        return super().soft_undelete(request, queryset)

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
    actions = (update_meta_file, update_meta)
    list_display = ("name", "deleted_at")

    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        if 'file' in form.changed_data and obj.file:
            file = obj.file
            obj.file = None
            super().save_model(request, obj, form, change)
            obj.file.save(file.name, file)
            obj.update_meta()
        else:
            super().save_model(request, obj, form, change)


class DataSourceJobStepInline(admin.TabularInline):
    model = models.DataSourceJobStep
    extra = 0


@admin.register(models.DataSourceJob)
class DataSourceJobAdmin(utils_admin.SoftDeleteObjectAdmin):
    actions = (update_meta,)
    list_display = ('pk', 'datasource', 'created')
    inlines = [DataSourceJobStepInline]


@admin.register(models.Folder)
class FolderAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ('id', 'name', 'project')
    search_fields = ('name',)
    list_filter = ('project',)


@admin.register(models.Page)
class PageAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ('id', 'title', 'folder', 'project')
    search_fields = ('title',)
    list_filter = ('folder',)

    def project(self, obj):
        return obj.folder.project.title


@admin.register(models.Block)
class BlockAdmin(utils_admin.SoftDeleteObjectAdmin):
    form = forms.BlockForm
    list_display = ('id', 'name', 'page', 'folder', 'project')
    search_fields = ('name',)
    list_filter = ('page',)

    def folder(self, obj):
        return obj.page.folder.name

    def project(self, obj):
        return obj.page.folder.project.title
