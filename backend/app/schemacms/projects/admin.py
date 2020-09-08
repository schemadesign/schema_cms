from django import forms
from django import http as dj_http
from django.contrib import admin
from django.shortcuts import render
from django.template.loader import render_to_string
from django.urls import path
from django.utils import safestring

from . import models, exporting
from ..users.models import User
from ..utils import admin as utils_admin


class ProjectImportForm(forms.Form):
    zip_file = forms.FileField()
    owner = forms.ModelChoiceField(queryset=User.objects.all())

    def save(self):
        raise Exception(self.cleaned_data)


@admin.register(models.Project)
class ProjectAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    fields = ("title", "description", "owner", "editors", "deleted_at")
    filter_horizontal = ("editors",)

    def get_urls(self):
        urls = super().get_urls()
        urls += [
            path("<pk>/export", self.admin_site.admin_view(self.export), name="project-export"),
            path("import", self.admin_site.admin_view(self.import_project), name="project-import"),
        ]
        return urls

    def export(self, request, pk):
        zipped = exporting.export_project(pk)
        return dj_http.HttpResponse(zipped.getvalue(), content_type="application/zip")

    def import_project(self, request):
        if request.method == "POST":
            form = ProjectImportForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
        else:
            form = ProjectImportForm()

        return render(request, "admin/projects/project/import_form.html", {"form": form})

    def delete_selected(self, request, queryset):
        return super().delete_queryset(request, queryset.exclude(deleted_at__isnull=0))

    delete_selected.short_description = "Soft delete selected objects"

    def soft_undelete(self, request, queryset):
        return self.handle_unique_conflicts_on_undelete(
            request, queryset, field="title", model_name="Project"
        )

    soft_undelete.short_description = "Undelete selected objects"

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["editors"].queryset = User.objects.filter(role="editor")
        return form

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("owner").prefetch_related("editors")

    def get_editors(self, obj):
        # to reduce db calls use prefetch related cache
        emails = (editor.email for editor in obj.editors.all())
        html = render_to_string("common/unordered_list.html", context=dict(objects=emails))
        return safestring.mark_safe(html)

    get_editors.short_description = "Editors"
