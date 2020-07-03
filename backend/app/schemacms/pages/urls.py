from django.urls import include, path

from rest_framework import routers

from . import views

app_name = "pages"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"block-templates", views.BlockTemplateViewSet)
router.register(r"page-templates", views.PageTemplateViewSet, basename="page-template")
router.register(r"sections", views.SectionViewSet)
router.register(r"pages", views.PageViewSet)
router.register(r"projects/(?P<project_pk>\d+)/sections", views.SectionListCreateView, basename="sections")
router.register(r"sections/(?P<section_pk>\d+)/pages", views.PageListCreateView, basename="pages")

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
        "projects/<project_pk>/sections/internal-connections",
        views.SectionInternalConnectionView.as_view(),
        name="section_internal_connections",
    ),
    path("", include(router.urls)),
]
