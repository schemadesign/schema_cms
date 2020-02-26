from django.urls import path
from rest_framework import routers

from . import views

app_name = "datasources"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"datasources", views.DataSourceViewSet)
router.register(r"filters", views.FilterDetailViewSet)
router.register(r"jobs", views.DataSourceJobDetailViewSet)

urlpatterns = router.urls + [
    path("script/<int:pk>", views.DataSourceScriptDetailView.as_view(), name="script_detail")
]
