from django.contrib import admin

from . import models
from ..utils import admin as utils_admin


@admin.register(models.State)
class StateAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("name", "project", "datasource", "deleted_at")
    fields = (
        "project",
        "datasource",
        "name",
        "description",
        "source_url",
        "author",
        "is_public",
        "deleted_at",
    )
    list_filter = ("project", "datasource", "is_public", "deleted_at")
    readonly_on_update_fields = ("project",)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="State", parent="project"
        )
