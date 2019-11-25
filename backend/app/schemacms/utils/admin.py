from django.db import models
import softdelete.admin


class SoftDeleteObjectAdmin(softdelete.admin.SoftDeleteObjectAdmin):
    deletion_q = models.Q(deleted_at__isnull=0)

    def delete_selected(self, request, queryset):
        # prevent hard delete on soft delete action
        return super().delete_queryset(request, queryset.exclude(self.deletion_q))

    delete_selected.short_description = 'Soft delete selected objects'

    def soft_undelete(self, request, queryset):
        return super().soft_undelete(request, queryset.filter(self.deletion_q))

    soft_undelete.short_description = 'Undelete selected objects'
