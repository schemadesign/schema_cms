from django.contrib import admin
from django.db import transaction

from .models import DataSource, Project


admin.site.register(Project)


@admin.register(DataSource)
class DataSource(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        file = obj.file
        obj.file = None
        with transaction.atomic():
            super().save_model(request, obj, form, change)
            obj.file.save(file.name, file)
