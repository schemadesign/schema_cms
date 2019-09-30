from rest_framework import routers

from . import routers as user_routers, views as user_views

current_user_router = user_routers.CurrentUserRouter(trailing_slash=False)
current_user_router.register(r"users/me", user_views.CurrentUserViewSet, basename="me")

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"users", user_views.UserViewSet)

urlpatterns = current_user_router.urls + router.urls
