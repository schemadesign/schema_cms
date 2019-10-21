from django.contrib import admin
from django.db import transaction

from . import models


admin.site.register(models.WranglingScript)


@admin.register(models.Project)
class Project(admin.ModelAdmin):
    filter_horizontal = ("editors",)


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
