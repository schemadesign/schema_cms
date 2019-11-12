import softdelete.admin


class SoftDeleteObjectAdmin(softdelete.admin.SoftDeleteObjectAdmin):
    def delete_selected(self, request, queryset):
        # prevent hard delete on soft delete action
        return super().delete_queryset(request, queryset.exclude(deleted_at__isnull=0))

    delete_selected.short_description = 'Soft delete selected objects'
