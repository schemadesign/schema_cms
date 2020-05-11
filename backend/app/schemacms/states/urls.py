from rest_framework import routers

from . import views

app_name = "states"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"states", views.StateDetailViewSet)

urlpatterns = router.urls
