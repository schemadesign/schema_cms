import itertools

from django.contrib import messages
from django.db import models
from django.template.loader import render_to_string
from django.utils import safestring


import softdelete.admin


class SoftDeleteObjectAdmin(softdelete.admin.SoftDeleteObjectAdmin):
    actions = ["soft_undelete"]
    deletion_q = models.Q(deleted_at__isnull=0)

    def delete_selected(self, request, queryset):
        # prevent hard delete on soft delete action
        return super().delete_queryset(request, queryset.exclude(self.deletion_q))

    delete_selected.short_description = 'Soft delete selected objects'

    def soft_undelete(self, request, queryset):
        return super().soft_undelete(request, queryset.filter(self.deletion_q))

    soft_undelete.short_description = 'Undelete selected objects'

    def handle_unique_conflicts_on_undelete(self, request, queryset, field, model_name):
        queryset = queryset.filter(deleted_at__isnull=0)
        if queryset.values(field).annotate(c=models.Count(field)).filter(c__gt=1).exists():
            msg = f"{model_name}(s) have the same name. Please change the name before undeleting"
            self.message_user(request=request, message=msg, level=messages.ERROR)
            return
        conflicts = (
            self.model.objects.values_list(field, flat=True)
            .filter(**{f"{field}__in": queryset.values(field)})
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
                f"{model_name}(s) with name: {html} already exists. "
                f"Please change name of this {model_name} before undeleting it."
            )
            self.message_user(request=request, message=msg, level=messages.ERROR)
            return

        return SoftDeleteObjectAdmin.soft_undelete(self, request, queryset)
