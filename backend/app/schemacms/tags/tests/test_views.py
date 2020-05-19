import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.tags import models, serializers

pytestmark = [pytest.mark.django_db]


class TestTagCategoryListCreateView:
    @staticmethod
    def get_url(project_pk):
        return reverse("tag-categories-list", kwargs=dict(project_pk=project_pk))

    def test_list_response_as_admin(self, api_client, admin, project, tag_category_factory):
        tag_category_factory.create_batch(3, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3
        assert (
            response.data["results"]
            == serializers.TagCategorySerializer(project.tags_categories, many=True).data
        )

    def test_list_response_as_editor(self, api_client, editor, project, tag_category_factory):
        tag_category_factory.create_batch(2, project=project)
        tag_category_factory.create_batch(3, project=project, is_available=True)

        api_client.force_authenticate(editor)
        response = api_client.get(self.get_url(project.id))

        tags = project.tags_categories.filter(is_available=True)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3
        assert response.data["results"] == serializers.TagCategorySerializer(tags, many=True).data

    def test_create(self, api_client, admin, project):

        payload = {
            "name": "Test Category",
            "delete_tags": [],
            "is_single_select": False,
            "is_public": True,
            "tags": [{"value": "Tag 1", "order": 0}, {"value": "Tag 2", "order": 1}],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), data=payload, format="json")
        category = models.TagCategory.objects.get(pk=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == serializers.TagCategorySerializer(category).data

    def test_not_allow_editor_create(self, api_client, editor, project):
        payload = {
            "name": "Test Category",
            "delete_tags": [],
            "is_single_select": False,
            "is_public": True,
            "tags": [{"value": "Tag 1", "order": 0}, {"value": "Tag 2", "order": 1}],
        }

        api_client.force_authenticate(editor)
        response = api_client.post(self.get_url(project.id), data=payload, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN
