from django import urls

from . import views as auth_views

app_name = "authorization"

urlpatterns = [
    urls.path("token", auth_views.obtain_jwt_token, name="token"),
    urls.path("logout", auth_views.logout, name="logout"),
]
