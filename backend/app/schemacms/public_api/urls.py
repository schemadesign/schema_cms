from rest_framework import routers

from . import views


app_name = "public_api"

router = routers.DefaultRouter(trailing_slash=False)
router.APIRootView = views.PARootView

router.register(r"datasources", views.PADataSourceView, basename="pa-datasources")
router.register(r"pages", views.PAPageView, basename="pa-pages")
router.register(r"projects", views.PAProjectView, basename="pa-projects")
router.register(r"sections", views.PASectionView, basename="pa-sections")
router.register(
    r"pages/(?P<page_pk>\d+)/blocks", views.PABlocksView, basename="pa-blocks",
)
router.register(
    r"projects/(?P<project_pk>\d+)/tags", views.TagCategoryListView, basename="pa-tags",
)

urlpatterns = router.urls
