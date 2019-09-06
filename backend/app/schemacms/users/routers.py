from rest_framework import routers


class CurrentUserRouter(routers.SimpleRouter):
    routes = [
        routers.Route(
            url=r"^{prefix}$",
            mapping={"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"},
            name="{basename}-detail",
            detail=True,
            initkwargs={"suffix": "Detail"},
        ),
        routers.DynamicRoute(
            url=r"^{prefix}/{url_path}$", name="{basename}-{url_name}", detail=True, initkwargs={}
        ),
    ]
