# from django.contrib import admin
# from django.db import transaction
#
# from ..utils import admin as utils_admin
# from . import models
#
#
# def update_meta_file(modeladmin, request, queryset):
#     for obj in queryset.iterator():
#         obj.create_dynamo_item()
#
#
# def update_meta(modeladmin, request, queryset):
#     for obj in queryset.iterator():
#         obj.schedule_update_meta(copy_steps=False)
#
#
# @admin.register(models.WranglingScript)
# class WranglingScriptAdmin(utils_admin.SoftDeleteObjectAdmin):
#     readonly_fields = ("specs",)
#     readonly_on_update_fields = ("datasource",)
#
#     def soft_undelete(self, request, queryset):
#         self.handle_unique_conflicts_on_undelete(
#             request, queryset, field="name", model_name="Script", parent="datasource"
#         )
#
#
# @admin.register(models.Filter)
# class FilterAdmin(utils_admin.SoftDeleteObjectAdmin):
#     list_display = ("name", "datasource", "deleted_at")
#     fields = ("datasource", "name", "filter_type", "field", "field_type", "deleted_at")
#     readonly_on_update_fields = ("datsource",)
#
#     def soft_undelete(self, request, queryset):
#         self.handle_unique_conflicts_on_undelete(
#             request, queryset, field="name", model_name="Filter", parent="datasource"
#         )
#
# @admin.register(models.DataSource)
# class DataSourceAdmin(utils_admin.SoftDeleteObjectAdmin):
#     actions = utils_admin.SoftDeleteObjectAdmin.actions + [update_meta_file, update_meta]
#     list_display = ("name", "project", "deleted_at")
#     fields = ("project", "name", "created_by", "type", "file", "active_job", "deleted_at")
#     list_filter = ("project", "type", "deleted_at")
#     readonly_on_update_fields = ("project",)
#
#     def soft_undelete(self, request, queryset):
#         self.handle_unique_conflicts_on_undelete(
#             request, queryset, field="name", model_name="DataSource", parent="project"
#         )
#
#     def get_form(self, request, obj=None, **kwargs):
#         form = super().get_form(request, obj, **kwargs)
#         form.base_fields["active_job"].queryset = models.DataSourceJob.objects.filter(datasource=obj)
#         return form
#
#     def get_queryset(self, request):
#         return super().get_queryset(request).select_related("active_job", "project", "created_by")
#
#     @transaction.atomic()
#     def save_model(self, request, obj, form, change):
#         if "file" in form.changed_data and obj.file:
#             file = obj.file
#             obj.file = None
#             super().save_model(request, obj, form, change)
#             obj.file.save(file.name, file)
#         else:
#             super().save_model(request, obj, form, change)
#
#         models.DataSourceMeta.objects.update_or_create(datasource=obj, defaults={"datasource": obj})
#
#
# class DataSourceJobStepInline(admin.TabularInline):
#     model = models.DataSourceJobStep
#     exclude = ("deleted_at",)
#     extra = 0
#
#
# @admin.register(models.DataSourceJob)
# class DataSourceJobAdmin(utils_admin.SoftDeleteObjectAdmin):
#     actions = utils_admin.SoftDeleteObjectAdmin.actions + [update_meta]
#     list_display = ("pk", "datasource", "job_state", "created", "deleted_at")
#     fields = ("datasource", "job_state", "description", "result", "error", "deleted_at")
#     readonly_on_update_fields = ("datasource",)
#     list_filter = ("datasource",)
#     inlines = [DataSourceJobStepInline]
