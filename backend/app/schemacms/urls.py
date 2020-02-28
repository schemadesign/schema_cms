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
                urls.path("", urls.include("schemacms.projects.urls")),
                urls.path("", urls.include("schemacms.datasources.urls")),
                urls.path("", urls.include("schemacms.states.urls")),
                urls.path("", urls.include("schemacms.users.urls")),
                urls.path("", urls.include("schemacms.pages.urls")),
                urls.path("", urls.include("rest_framework.urls", namespace="rest_framework")),
            ]
        ),
    ),
    urls.path("admin/", admin.site.urls),
    urls.path("", misc_views.HomeView.as_view(), name="home"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    import debug_toolbar

    urlpatterns = (
        [
            urls.path("__debug__/", urls.include(debug_toolbar.urls)),
            urls.path("silk/", urls.include("silk.urls", namespace="silk")),
        ]
        + urlpatterns
        + static(settings.STATIC_URL)
    )
