from rest_framework import routers

from . import views

app_name = "projects"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"projects", views.ProjectViewSet)

urlpatterns = router.urls
