import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.tags import serializers

pytestmark = [pytest.mark.django_db]


class TestTagCategoryListCreateView:
    @staticmethod
    def get_url(project_pk):
        return reverse("tag-categories-list", kwargs=dict(project_pk=project_pk))

    def test_list_response(self, api_client, admin, project, tag_category_factory):
        tag_category_factory.create_batch(3, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3
        assert (
            response.data["results"]
            == serializers.TagCategorySerializer(project.tags_categories, many=True).data
        )
