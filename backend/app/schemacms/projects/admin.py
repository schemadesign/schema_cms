import softdelete.admin
from django.contrib import admin
from django.db import transaction
from django.utils import safestring
from django.template.loader import render_to_string

from . import models


admin.site.register(models.WranglingScript)


@admin.register(models.Project)
class Project(softdelete.admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    filter_horizontal = ("editors",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner").prefetch_related("editors")

    def get_editors(self, obj):
        html = render_to_string(
            "common/unordered_list.html", context=dict(objects=obj.editors.values_list("email", flat=True))
        )
        return safestring.mark_safe(html)

    get_editors.short_description = "Editors"


@admin.register(models.DataSource)
class DataSource(admin.ModelAdmin):
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
class DataSourceJobAdmin(admin.ModelAdmin):
    list_display = ('pk', 'datasource', 'created')
    inlines = [DataSourceJobStepInline]
