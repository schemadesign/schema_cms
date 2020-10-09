import zipfile

from django import forms
from django import http as dj_http
from django.contrib import admin
from django.core import serializers
from django.shortcuts import render
from django.db import transaction
from django.template.loader import render_to_string
from django.urls import path
from django.conf import settings
from django.utils import safestring, timezone
from django.core.files import File
from . import models, exporting
from ..users.models import User
from ..utils import admin as utils_admin
import os


from ..utils.services import s3

from ..datasources.models import DataSource, DataSourceJob, DataSourceJobMetaData, DataSourceMeta


class ProjectImportForm(forms.Form):
    zip_file = forms.FileField()
    owner = forms.ModelChoiceField(queryset=User.objects.all())

    @staticmethod
    def get_file_base_name(name):
        return

    @transaction.atomic()
    def save(self):
        import_time = timezone.now()

        input_zip = self.cleaned_data["zip_file"]
        with zipfile.ZipFile(input_zip, "r") as zip_file:

            objs_with_deferred_fields = []

            for deserialized_object in serializers.deserialize(
                "json", zip_file.read("objects.json"), handle_forward_references=True, ignorenonexistent=True
            ):

                print(deserialized_object)

                object_fields = [f.name for f in deserialized_object.object._meta.get_fields()]

                if isinstance(deserialized_object.object, models.Project):
                    self.import_project_model(zip_file, deserialized_object)

                if isinstance(deserialized_object.object, DataSource):
                    self.import_files(zip_file, deserialized_object, ("file",))
                if isinstance(deserialized_object.object, (DataSourceMeta, DataSourceJobMetaData)):
                    self.import_files(zip_file, deserialized_object, ("preview",))
                if isinstance(deserialized_object.object, DataSourceJob):
                    self.import_files(zip_file, deserialized_object, ("result", "result_parquet"))

                if "created" in object_fields and "modified" in object_fields:
                    deserialized_object.object.created = import_time
                    deserialized_object.object.modified = import_time

                if "created_by" in object_fields:
                    deserialized_object.object.created_by = self.cleaned_data["owner"]

                deserialized_object.save()

                if deserialized_object.deferred_fields is not None:
                    objs_with_deferred_fields.append(deserialized_object)

            for obj in objs_with_deferred_fields:
                obj.save_deferred_fields()

    def import_project_model(self, zip_file, deserialized_object):
        deserialized_object.object.owner = self.cleaned_data["owner"]
        deserialized_object.save()

        with zip_file.open(f"files/{deserialized_object.object.xml_file.name}", "r") as file:
            file_name = deserialized_object.object.relative_path_to_save(os.path.basename(file.name))
            file = File(file, name=file_name)
            deserialized_object.object.xml_file = file

            s3.put_object(
                Body=file, Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name, ACL="public-read",
            )

    @staticmethod
    def import_files(zip_file, deserialized_object, file_attrs):
        deserialized_object.save()

        for file_attr in file_attrs:
            if object_file := getattr(deserialized_object.object, file_attr):
                with zip_file.open(f"files/{object_file.name}", "r") as file:
                    file_name = deserialized_object.object.relative_path_to_save(os.path.basename(file.name))
                    file = File(file, name=file_name)

                    setattr(deserialized_object.object, file_attr, file)

                    s3.put_object(
                        Body=file, Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name, ACL="public-read",
                    )


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
