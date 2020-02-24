from django.contrib import admin
from django.forms.models import BaseInlineFormSet
from django.core.exceptions import ValidationError

from ..utils import admin as utils_admin
from . import models


class TagInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        if not all(self.cleaned_data):
            raise ValidationError("Tag value can't be empty")


class TagInline(admin.TabularInline):
    formset = TagInlineFormSet
    model = models.Tag
    exclude = ("deleted_at",)
    extra = 0


@admin.register(models.TagsList)
class TagAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("name", "datasource", "deleted_at")
    fields = ("datasource", "name", "deleted_at")
    list_filter = ("datasource", "deleted_at")
    readonly_on_update_fields = ("datasource",)
    inlines = (TagInline,)

    def soft_undelete(self, request, queryset):
        self.handle_unique_conflicts_on_undelete(
            request, queryset, field="name", model_name="TagsList", parent="datasource"
        )


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
