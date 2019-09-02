from rest_framework import response, status, views


class HomeView(views.APIView):
    permission_classes = []

    def get(self, request):
        return response.Response(status=status.HTTP_200_OK)
