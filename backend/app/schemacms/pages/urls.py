from django.urls import include, path

from rest_framework import routers

from . import views

app_name = "pages"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"block-templates", views.BlockTemplateViewSet)
router.register(r"page-templates", views.PageTemplateViewSet)

section_list_create = views.SectionViewSet.as_view({"get": "list", "post": "create"})

urlpatterns = [
    path(
        "projects/<project_pk>/block-templates",
        views.BlockTemplateListCreteView.as_view(),
        name="block_templates_list_create",
    ),
    path(
        "projects/<project_pk>/page-templates",
        views.PageTemplateListCreteView.as_view(),
        name="page_templates_list_create",
    ),
    path("projects/<project_pk>/sections", section_list_create, name="section_list_create",),
    path("", include(router.urls)),
]
