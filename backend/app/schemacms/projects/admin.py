import zipfile
import json
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
from ..pages.models import PageBlockElement, CustomElementSet, PageBlockObservableElement
from ..pages.constants import ElementType


@admin.register(models.ProjectsSettings)
class ProjectsSettings(admin.ModelAdmin):
    pass


class ProjectImportForm(forms.Form):
    zip_file = forms.FileField()
    owner = forms.ModelChoiceField(queryset=User.objects.all())

    def clean_zip_file(self):
        input_zip = self.cleaned_data["zip_file"]

        with zipfile.ZipFile(input_zip, "r") as zip_file:
            extra_data = json.loads(zip_file.read("extra_data.json"))

            if models.Project.objects.filter(title=extra_data["project_title"]).exists():
                message = (
                    "Project with same title already exist in SchemaCMS"
                    "please rename existing project before import."
                )
                raise forms.ValidationError(message)

        return input_zip

    @transaction.atomic()
    def save(self):
        import_time = timezone.now()

        input_zip = self.cleaned_data["zip_file"]

        with zipfile.ZipFile(input_zip, "r") as zip_file:

            objs_with_deferred_fields = []
            custom_element_sets = {}

            for deserialized_object in serializers.deserialize(
                "json", zip_file.read("objects.json"), handle_forward_references=True
            ):

                object_fields = [f.name for f in deserialized_object.object._meta.get_fields()]
                if isinstance(deserialized_object.object, models.Project):
                    self.import_project_model(zip_file, deserialized_object, import_time)
                    continue

                if isinstance(deserialized_object.object, DataSource):
                    self.import_files(zip_file, deserialized_object, ("file",))
                if isinstance(deserialized_object.object, (DataSourceMeta, DataSourceJobMetaData)):
                    self.import_files(zip_file, deserialized_object, ("preview",))
                if isinstance(deserialized_object.object, DataSourceJob):
                    self.import_files(
                        zip_file, deserialized_object, ("result", "result_parquet"), is_job=True
                    )
                if isinstance(deserialized_object.object, PageBlockElement):
                    if obs_ele := deserialized_object.object.observable_hq:

                        obs_ele = PageBlockObservableElement.objects.create(
                            observable_user=obs_ele.observable_user,
                            observable_notebook=obs_ele.observable_notebook,
                            observable_cell=obs_ele.observable_cell,
                            observable_params=obs_ele.observable_params,
                        )
                        deserialized_object.object.observable_hq = obs_ele

                    if deserialized_object.deferred_fields:
                        deferred_to_remove = []

                        for field, value in deserialized_object.deferred_fields.items():
                            if field.name == "custom_element_set":
                                c_set_id = value[0]
                                c_set_order = value[1]

                                id_ = custom_element_sets.get(str(c_set_id))
                                new_set, _ = CustomElementSet.objects.get_or_create(
                                    id=id_, defaults=dict(order=c_set_order)
                                )
                                custom_element_sets[str(c_set_id)] = new_set.id
                                deserialized_object.object.custom_element_set = new_set
                                deferred_to_remove.append(field)

                            if field.name == "observable_hq":
                                data = dict(
                                    observable_user=value[1],
                                    observable_notebook=value[2],
                                    observable_cell=value[3],
                                    observable_params=value[4],
                                )

                                obs_ele = PageBlockObservableElement.objects.create(**data)
                                deserialized_object.object.observable_hq = obs_ele
                                deferred_to_remove.append(field)

                        for field in deferred_to_remove:
                            del deserialized_object.deferred_fields[field]

                    if deserialized_object.object.type in [ElementType.IMAGE, ElementType.FILE]:
                        self.import_files(
                            zip_file,
                            deserialized_object,
                            (deserialized_object.object.type,),
                            settings.AWS_STORAGE_PAGES_BUCKET_NAME,
                            acl="public-read",
                        )

                if "created" in object_fields and "modified" in object_fields:
                    deserialized_object.object.created = import_time
                    deserialized_object.object.modified = import_time

                deserialized_object.save()

                if deserialized_object.deferred_fields:
                    for field, value in deserialized_object.deferred_fields.items():
                        if field.name in ["author", "created_by"]:
                            deserialized_object.deferred_fields[field] = self.cleaned_data["owner"].id

                    objs_with_deferred_fields.append(deserialized_object)

            for obj in objs_with_deferred_fields:
                try:
                    obj.save_deferred_fields()
                except Exception:
                    continue

    def import_project_model(self, zip_file, deserialized_object, import_time):
        new_project = models.Project()
        new_project.title = deserialized_object.object.title
        new_project.description = deserialized_object.object.description
        new_project.owner = self.cleaned_data["owner"]
        new_project.created = import_time
        new_project.modified = import_time
        new_project.status = deserialized_object.object.status
        new_project.slug = deserialized_object.object.slug

        new_project.save()

        if deserialized_object.object.xml_file:
            with zip_file.open(f"files/{deserialized_object.object.xml_file.name}", "r") as file:
                key = f"rss/{new_project.id}/{new_project.title.lower().replace(' ', '-')}-rss.xml"
                file = File(file, name=key)
                new_project.xml_file = file

                s3.put_object(
                    Body=file,
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                    Key=key,
                    ACL="public-read",
                    ContentType="application/rss+xml",
                )

                new_project.save(update_fields=["xml_file"])

    @staticmethod
    def import_files(
        zip_file,
        deserialized_object,
        file_attrs,
        bucket=settings.AWS_STORAGE_BUCKET_NAME,
        is_job=False,
        acl="public-read",
    ):
        deserialized_object.save()

        for file_attr in file_attrs:
            if object_file := getattr(deserialized_object.object, file_attr):
                with zip_file.open(f"files/{object_file.name}", "r") as file:
                    if is_job:
                        _, file_extension = os.path.splitext(file.name)
                        file_name = deserialized_object.object.relative_path_to_save(
                            f"job_{deserialized_object.object.id}_result{file_extension}"
                        )

                    else:
                        file_name = deserialized_object.object.relative_path_to_save(
                            os.path.basename(file.name)
                        )

                    file = File(file, name=file_name)

                    setattr(deserialized_object.object, file_attr, file)

                    s3.put_object(
                        Body=file, Bucket=bucket, Key=file_name, ACL=acl,
                    )

        if is_job and deserialized_object.object.source_file_path:
            base_name = deserialized_object.object.source_file_path.split(".")[0]
            original_file_path = f"{base_name}_export_version.csv"
            base_name = os.path.basename(original_file_path)

            new_path = f"{deserialized_object.object.datasource_id}/uploads/{base_name}"

            with zip_file.open(f"files/{original_file_path}", "r") as file:
                file = File(file, name=new_path)
                response = s3.put_object(Body=file, Bucket=bucket, Key=new_path)

            setattr(deserialized_object.object, "source_file_path", new_path)
            setattr(deserialized_object.object, "source_file_version", response["VersionId"])


@admin.register(models.Project)
class ProjectAdmin(utils_admin.SoftDeleteObjectAdmin):
    list_display = ("title", "owner", "status", "get_editors", "deleted_at")
    fields = ("title", "description", "owner", "editors", "deleted_at")
    filter_horizontal = ("editors",)
    change_list_template = "admin/projects/project/change_list.html"

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
