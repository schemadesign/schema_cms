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
        return reverse("pages:block_templates_list_create", kwargs=dict(project_pk=pk))

    def test_response(self, api_client, admin, project, block_template_factory):
        block_template_factory.create_batch(3, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.pk))
        queryset = projects_models.Project.objects.get(id=project.pk).block_set.filter(is_template=True)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.BlockTemplateSerializer(queryset, many=True).data


class TestCreateBlockTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:block_templates_list_create", kwargs=dict(project_pk=pk))

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
        block = pages_models.Block.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.BlockTemplateSerializer(block).data

    def test_400_on_create_template_without_elements(self, api_client, admin, project):
        payload = {"name": "Test Block"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.pk), data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_editor_can_not_create_template(self, api_client, editor, project):
        payload = {"name": "Test Block"}

        api_client.force_authenticate(editor)
        response = api_client.post(self.get_url(project.pk), data=payload, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestUpdateDeleteBlockTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:block-detail", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, block_template):
        new_name = "New Block Name"

        payload = {"id": block_template.pk, "name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(block_template.pk), data=payload, format="json")
        block = pages_models.Block.objects.get(id=response.data["id"])

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

    def test_deleting_block_elements(self, api_client, admin, block_template, block_template_element_factory):
        elements = block_template_element_factory.create_batch(3, template=block_template)
        payload = {"delete_elements": [elements[0].id, elements[1].id]}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(block_template.pk), data=payload, format="json")
        block_template.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert len(block_template.elements.all()) == 1

    def test_editor_can_not_update_template(self, api_client, editor, block_template):
        new_name = "New Block Name"

        payload = {"id": block_template.pk, "name": new_name}

        api_client.force_authenticate(editor)
        response = api_client.patch(self.get_url(block_template.pk), data=payload, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_block_template(self, api_client, admin, block_template):
        template_id = block_template.id
        api_client.force_authenticate(admin)
        response = api_client.delete(self.get_url(block_template.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not pages_models.Block.objects.filter(pk=template_id, deleted_at__isnull=True).exists()


class TestUpdatePageTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page-template-detail", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, page_template):
        new_name = "New Page Name"

        payload = {"id": page_template.pk, "name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page_template.pk), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_200_OK
        assert response.data == page_serializer.PageTemplateSerializer(page).data
        assert page.name == new_name

    def test_update_with_blocks(self, api_client, admin, page_template, page_block_factory):
        blocks = page_block_factory.create_batch(3, page=page_template)
        new_block_name = "New Block Name"
        payload = {
            "blocks": [
                {"id": blocks[0].id, "name": new_block_name, "order": 1},
                {"name": "NewBlock", "block": blocks[0].block_id, "order": 2},
            ]
        }
        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page_template.pk), data=payload, format="json")
        page_template.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert len(page_template.pageblock_set.all()) == 4
        assert page_template.pageblock_set.get(pk=blocks[0].id).name == new_block_name

    def test_deleting_page_blocks(self, api_client, admin, page_template, page_block_factory):
        blocks = page_block_factory.create_batch(3, page=page_template)
        payload = {"delete_blocks": [blocks[0].id, blocks[1].id]}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page_template.pk), data=payload, format="json")
        page_template.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert len(page_template.blocks.through.objects.all()) == 1

    def test_editor_can_not_update_template(self, api_client, editor, page_template):
        new_name = "New Page Name"

        payload = {"id": page_template.pk, "name": new_name}

        api_client.force_authenticate(editor)
        response = api_client.patch(self.get_url(page_template.pk), data=payload, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestListPageTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page_templates_list_create", kwargs=dict(project_pk=pk))

    def test_response(self, api_client, admin, project, page_template_factory):
        page_template_factory.create_batch(3, project=project)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.pk))
        queryset = projects_models.Project.objects.get(id=project.pk).page_set.filter(is_template=True)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.PageTemplateSerializer(queryset, many=True).data


class TestDeletePageTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page-template-detail", kwargs=dict(pk=pk))

    def test_delete_page_template(self, api_client, admin, page_template):
        template_id = page_template.id
        api_client.force_authenticate(admin)
        response = api_client.delete(self.get_url(page_template.pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not pages_models.Page.objects.filter(pk=template_id, deleted_at__isnull=True).exists()


class TestListCreateSectionView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:section_list_create", kwargs=dict(project_pk=pk))

    def test_list_section(self, api_client, admin, section):
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(section.project_id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1

    def test_create_section(self, api_client, admin, project):
        payload = {"name": "Test Name"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), data=payload, format="json")
        section = pages_models.Section.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.SectionListCreateSerializer(section).data


class TestUpdateDeleteSectionView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:section-detail", kwargs=dict(pk=pk))

    def test_retrieve_section(self, api_client, admin, section):
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(section.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.SectionDetailSerializer(section).data

    def test_update_section(self, api_client, admin, section):
        new_name = "New Section Name"
        payload = {"name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(section.id), data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK

    def test_delete_section(self, api_client, admin, section):
        section_id = section.id
        api_client.force_authenticate(admin)
        response = api_client.delete(self.get_url(section.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not pages_models.Section.objects.filter(pk=section_id, deleted_at__isnull=True).exists()


class TestListCreatePage:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page_list_create", kwargs=dict(section_pk=pk))

    def test_list_pages(self, api_client, admin, page):
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(page.section_id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1

    def test_create_page_without_blocks(
        self, api_client, admin, project, page_template_factory, section_factory
    ):
        section = section_factory(project=project)
        page_template = page_template_factory(project=project)

        payload = {
            "name": "Test",
            "section": section.id,
            "template": page_template.id,
            "display_name": "Display Name",
            "description": "description",
            "keywords": "word;word1",
            "is_public": True,
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data
        assert page.is_template is False
        assert section.project == page_template.project == page.project


class TestUpdateDeletePageView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page-detail", kwargs=dict(pk=pk))

    def test_retrieve_page(self, api_client, admin, page):
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(page.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.PageSerializer(page).data

    def test_update_page(self, api_client, admin, page):
        new_name = "New Page Name"
        payload = {"name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        page.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert page.name == new_name

    def test_delete_page(self, api_client, admin, page):
        page_id = page.id
        api_client.force_authenticate(admin)
        response = api_client.delete(self.get_url(page.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not pages_models.Page.objects.filter(pk=page_id, deleted_at__isnull=True).exists()
