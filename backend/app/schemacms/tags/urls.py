from rest_framework import routers

from . import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(
    r"projects/(?P<project_pk>\d+)/tag-categories",
    views.TagCategoryListCreateViewSet,
    basename="tag-categories",
)

router.register(r"tag-categories", views.TagCategoryDetailsViewSet, basename="tag-category")
urlpatterns = router.urls
