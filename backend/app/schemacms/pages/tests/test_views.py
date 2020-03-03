from django.urls import reverse
from rest_framework import status

import pytest

from schemacms.projects import models as projects_models
from schemacms.pages.constants import ElementType
from schemacms.pages import serializers as page_serializer, models as pages_models


pytestmark = [pytest.mark.django_db]


class TestListBlockTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("projects:project-block-templates", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, project, block_template_factory):
        block_template_factory.create_batch(3, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.pk))
        queryset = projects_models.Project.objects.get(id=project.pk).blocktemplate_set.all()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.BlockTemplateSerializer(queryset, many=True).data


class TestCreateBlockTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("projects:project-block-templates", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, project):
        name = "Test Block"
        elements = [
            {"name": "Ele1", "type": ElementType.PLAIN_TEXT, "order": 1, "params": {}},
            {"name": "Ele2", "type": ElementType.PLAIN_TEXT, "order": 2, "params": {}},
            {"name": "Ele3", "type": ElementType.PLAIN_TEXT, "order": 3, "params": {}},
        ]
        payload = {"name": name, "elements": elements}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.pk), data=payload, format="json")
        block = pages_models.BlockTemplate.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.BlockTemplateSerializer(block).data

    def test_400_on_create_template_without_elements(self, api_client, admin, project):
        payload = {"name": "Test Block"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.pk), data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestUpdateBlockTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:blocktemplate-detail", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, block_template):
        new_name = "New Block Name"

        payload = {"id": block_template.pk, "name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(block_template.pk), data=payload, format="json")
        block = pages_models.BlockTemplate.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_200_OK
        assert response.data == page_serializer.BlockTemplateSerializer(block).data
        assert block.name == new_name

    def test_update_with_elements(self, api_client, admin, block_template, block_template_element_factory):
        elements = block_template_element_factory.create_batch(3, template=block_template)
        new_element_name = "New Element Name"

        payload = {
            "elements": [
                {"id": elements[0].id, "name": new_element_name, "order": 1},
                {"name": "NewElement", "type": ElementType.PLAIN_TEXT, "order": 2, "params": {}},
            ]
        }
        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(block_template.pk), data=payload, format="json")
        block_template.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert len(block_template.elements.all()) == 4
        assert block_template.elements.get(pk=elements[0].id).name == new_element_name


class TestListPageTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("projects:project-page-templates", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, project, page_template_factory):
        page_template_factory.create_batch(3, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.pk))
        queryset = projects_models.Project.objects.get(id=project.pk).pagetemplate_set.all()

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.PageTemplateSerializer(queryset, many=True).data
