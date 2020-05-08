from rest_framework import routers

from . import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(
    r"projects/(?P<project_pk>\d+)/tag-categories", views.TagCategoryViewSet, basename="tag-categories"
)

urlpatterns = router.urls
