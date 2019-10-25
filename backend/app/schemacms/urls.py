from django.conf import settings
from django import urls
from django.conf.urls.static import static
from django.contrib import admin

from schemacms.misc import views as misc_views

urlpatterns = [
    urls.path(
        "api/v1/",
        urls.include(
            [
                urls.path("auth/", urls.include("schemacms.authorization.urls", namespace="authorization")),
                urls.path("auth/", urls.include("social_django.urls")),
                urls.path("", urls.include('schemacms.projects.urls')),
                urls.path("", urls.include("schemacms.users.urls")),
                urls.path("", urls.include("rest_framework.urls", namespace="rest_framework")),
            ]
        ),
    ),
    urls.path("admin/", admin.site.urls),
    urls.path("", misc_views.HomeView.as_view(), name="home")
    # the 'api-root' from django rest-frameworks default router
    # http://www.django-rest-framework.org/api-guide/routers/#defaultrouter
    # re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
