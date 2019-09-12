from django.contrib import admin
from django.db import transaction

from .models import DataSource, Project


admin.site.register(Project)


@admin.register(DataSource)
class DataSource(admin.ModelAdmin):
    @transaction.atomic()
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if 'file' in form.changed_data and obj.file:
            obj.update_meta()
