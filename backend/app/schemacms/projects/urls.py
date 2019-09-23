from django.urls import path

from schemacms.projects import views

app_name = 'projects'

urlpatterns = [
    path('datasource/<int:pk>/script', views.DataSourceScriptView.as_view(), name='script_list'),
    path(
        'datasource/<int:pk>/script-upload', views.DataSourceScriptUploadView.as_view(), name='script_upload'
    ),
    path('datasource/<int:pk>/job', views.DataSourceJobView.as_view(), name='datasource_job_list'),
    path('job/<int:pk>', views.DataSourceJobDetailView.as_view(), name='datasource_job_detail'),
]
