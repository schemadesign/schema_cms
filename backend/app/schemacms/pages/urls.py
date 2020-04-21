from django.urls import include, path

from rest_framework import routers

from . import views

app_name = "pages"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"block-templates", views.BlockTemplateViewSet)
router.register(r"page-templates", views.PageTemplateViewSet, basename="page-template")
router.register(r"sections", views.SectionViewSet)
router.register(r"pages", views.PageViewSet)


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
    path(
        "projects/<project_pk>/sections", views.SectionListCreateView.as_view(), name="section_list_create",
    ),
    path(
        "projects/<project_pk>/sections/internal-connections",
        views.SectionInternalConnectionView.as_view(),
        name="section_internal_connections",
    ),
    path("sections/<section_pk>/pages", views.PageListCreateView.as_view(), name="page_list_create",),
    path("", include(router.urls)),
]
