from django.urls import path
from rest_framework import routers

from schemacms.projects import views

app_name = 'projects'

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"projects", views.ProjectViewSet)
router.register(r"datasources", views.DataSourceViewSet)

urlpatterns = router.urls + [
    path('job/<int:pk>', views.DataSourceJobDetailView.as_view(), name='datasource_job_detail')
]
