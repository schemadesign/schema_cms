from django.urls import path
from rest_framework import routers

from schemacms.projects import views

app_name = 'projects'

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"projects", views.ProjectViewSet)
router.register(r"datasources", views.DataSourceViewSet)

urlpatterns = router.urls + [
    path("jobs/<int:pk>", views.DataSourceJobDetailView.as_view(), name="job_detail"),
    path("scripts/<int:pk>", views.DataSourceScriptDetailView.as_view(), name="script_detail"),
]
