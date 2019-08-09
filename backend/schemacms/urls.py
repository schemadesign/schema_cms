from django.conf import settings
from django import urls
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from .users import views as user_views
from .authorization import views as auth_views

router = DefaultRouter()
router.register(r'users', user_views.UserViewSet)
router.register(r'users', user_views.UserCreateViewSet)
urlpatterns = [
    urls.path('admin/', admin.site.urls),
    urls.path('api/v1/auth/token', auth_views.obtain_jwt_token),
    urls.path('api/v1/', urls.include(router.urls)),
    urls.path('api-auth/', urls.include('rest_framework.urls', namespace='rest_framework')),
    urls.path('auth/', urls.include('social_django.urls')),

    # the 'api-root' from django rest-frameworks default router
    # http://www.django-rest-framework.org/api-guide/routers/#defaultrouter
    # re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

