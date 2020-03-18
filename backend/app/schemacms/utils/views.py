from rest_framework import response, viewsets, mixins


class DetailViewSet(
    mixins.DestroyModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {"project": instance.project_info, "results": serializer.data}
        return response.Response(data)
