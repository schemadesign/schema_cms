import itertools

from django.core.validators import ValidationError
from django.contrib import messages
from django.db import models
from django.forms import ModelForm
from django.template.loader import render_to_string
from django.utils import safestring


import softdelete.admin
from softdelete.models import SoftDeleteObject


class SoftDeleteFormWithUniqueTogetherValidation(ModelForm):
    class Meta:
        model = SoftDeleteObject
        exclude = ("deleted_at",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = kwargs.get("instance")
        if instance:
            self.initial["deleted"] = instance.deleted

    def clean(self, *args, **kwargs):
        constraints = self.instance._meta.constraints
        if constraints and any([constrain.condition for constrain in constraints]):
            fields = [field for field in self.instance._meta.constraints[0].fields]
            filter_query = {}
            for field in fields:
                filter_query[field] = (
                    self.cleaned_data[field] if field in self.cleaned_data else getattr(self.instance, field)
                )

            if self.instance.__class__.objects.filter(**filter_query).exclude(pk=self.instance.id).exists():
                message = f"Object with this {fields[1]} already exists in {fields[0]}"
                raise ValidationError(message)

        cleaned_data = super().clean(*args, **kwargs)

        if "undelete" in self.data:
            self.instance.deleted = False
            cleaned_data["deleted"] = False
        return cleaned_data

    def save(self, commit=True, *args, **kwargs):
        model = super().save(commit=False, *args, **kwargs)
        if commit:
            model.save()
        return model


class SoftDeleteObjectAdmin(softdelete.admin.SoftDeleteObjectAdmin):
    actions = ["soft_undelete"]
    deletion_q = models.Q(deleted_at__isnull=0)
    readonly_on_update_fields = tuple()
    readonly_fields = ("deleted_at",)
    form = SoftDeleteFormWithUniqueTogetherValidation

    def delete_selected(self, request, queryset):
        # prevent hard delete on soft delete action
        return super().delete_queryset(request, queryset.exclude(self.deletion_q))

    delete_selected.short_description = "Soft delete selected objects"

    def soft_undelete(self, request, queryset):
        return super().soft_undelete(request, queryset.filter(self.deletion_q))

    soft_undelete.short_description = "Undelete selected objects"

    def handle_unique_conflicts_on_undelete(self, request, queryset, field, model_name, parent=None):
        if queryset.values(field).annotate(c=models.Count(field)).filter(c__gt=1).exists():
            msg = f"{model_name}(s) have the same name. Please change the name before undeleting"
            self.message_user(request=request, message=msg, level=messages.ERROR)
            return

        if parent:
            filters = {f"{field}__in": queryset.values(field), f"{parent}_id__in": queryset.values(parent)}
        else:
            filters = {f"{field}__in": queryset.values(field)}

        conflicts = self.model.objects.values_list(field, flat=True).filter(**filters).iterator()
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

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + self.readonly_on_update_fields
        return self.readonly_fields
