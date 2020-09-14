import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.public_api.serializers import PAProjectSerializer
from schemacms.projects import models as projects_models


pytestmark = [pytest.mark.django_db]


class TestPublicApiProjectListView:
    @staticmethod
    def get_url():
        return reverse("public_api:pa-projects-list")

    def test_response_for_non_authenticate_user(self, api_client, project_factory):
        project_factory.create_batch(3)
        response = api_client.get(self.get_url())

        queryset = projects_models.Project.objects.all().order_by("id")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3
        assert response.data["results"] == PAProjectSerializer(queryset, many=True).data

    def test_create_not_allowed(self, api_client):
        response = api_client.post(self.get_url(), data={})

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


class TestPublicApiProjectDetailView:
    @staticmethod
    def get_url(pk):
        return reverse("public_api:pa-projects-detail", kwargs=dict(pk=pk))

    def test_response_for_non_authenticate_user(self, api_client, project):
        response = api_client.get(self.get_url(project.id))

        expected_data = {
            "meta": {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "owner": project.owner.get_full_name(),
                "created": project.created.strftime("%Y-%m-%d"),
                "updated": project.modified.strftime("%Y-%m-%d"),
                "xml_file": None,
            },
            "data_sources": [],
            "content": {"sections": []},
        }

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_response_when_project_has_no_owner(self, api_client, project):
        project.owner = None
        project.save()

        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["meta"]["owner"] == ""

    def test_patch_not_allowed(self, api_client, project):
        response = api_client.patch(self.get_url(project.id), data={})

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_put_not_allowed(self, api_client, project):
        response = api_client.put(self.get_url(project.id), data={})

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_delete_not_allowed(self, api_client, project):
        response = api_client.delete(self.get_url(project.id))

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
