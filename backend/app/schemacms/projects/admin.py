from django.contrib import admin
from django.db import transaction

from . import models


admin.site.register(models.Project)


@admin.register(models.DataSource)
class DataSource(admin.ModelAdmin):
    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if 'file' in form.changed_data and obj.file:
            obj.update_meta()


@admin.register(models.DataSourceJob)
class DataSourceJobAdmin(admin.ModelAdmin):
    list_display = ('pk', 'status', 'datasource', 'created')
