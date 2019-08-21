from django.conf import settings
from django import urls
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from .users import views as user_views

router = DefaultRouter(trailing_slash=False)
router.register(r'users', user_views.UserViewSet)
urlpatterns = [
    urls.path(
        'api/v1/', urls.include([
            urls.path('auth/', urls.include('schemacms.authorization.urls', namespace='authorization')),
            urls.path('auth/', urls.include('social_django.urls')),
            urls.path('', urls.include(router.urls)),
            urls.path('', urls.include('rest_framework.urls', namespace='rest_framework')),
        ])
    ),
    urls.path('admin/', admin.site.urls),

    # the 'api-root' from django rest-frameworks default router
    # http://www.django-rest-framework.org/api-guide/routers/#defaultrouter
    # re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
