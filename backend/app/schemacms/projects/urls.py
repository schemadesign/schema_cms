from django.urls import path
from rest_framework import routers

from schemacms.projects import views

app_name = 'projects'

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"blocks", views.BlockViewSet)
router.register(r"datasources", views.DataSourceViewSet)
router.register(r"filters", views.FilterDetailViewSet)
router.register(r"folders", views.FolderViewSet)
router.register(r"jobs", views.DataSourceJobDetailViewSet)
router.register(r"pages", views.PageViewSet)
router.register(r"projects", views.ProjectViewSet)
router.register(r"tags", views.TagDetailViewSet)

urlpatterns = router.urls + [
    path("script/<int:pk>", views.DataSourceScriptDetailView.as_view(), name="script_detail")
]
