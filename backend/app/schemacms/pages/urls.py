from rest_framework import routers

from . import views

app_name = "pages"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"block-templates", views.BlockTemplateViewSet)
router.register(r"page-templates", views.PageTemplateViewSet)

urlpatterns = router.urls
