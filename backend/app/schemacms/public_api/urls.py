from rest_framework import routers

from . import views

app_name = "public_api"

router = routers.DefaultRouter(trailing_slash=False)

router.register(r"projects", views.PAProjectView, basename="pa-projects")
router.register(r"sections", views.PASectionView, basename="pa-sections")
router.register(r"pages", views.PAPageView, basename="pa-pages")
router.register(r"datasources", views.PADataSourceView, basename="pa-datasources")

urlpatterns = router.urls
