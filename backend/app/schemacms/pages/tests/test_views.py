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
        queryset = projects_models.Project.objects.get(id=project.pk).blocktemplate_set.order_by("-created")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.BlockTemplateSerializer(queryset, many=True).data

    def test_available_for_editor(self, api_client, editor, project, block_template_factory):
        block_template_factory.create_batch(1, project=project, is_available=False)
        block_template_factory.create_batch(2, project=project, is_available=True)

        api_client.force_authenticate(editor)
        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2


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
        block = pages_models.BlockTemplate.objects.get(id=response.data["id"])

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
                {"id": elements[0].id, "type": ElementType.PLAIN_TEXT, "name": new_element_name, "order": 1},
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
        assert not pages_models.BlockTemplate.objects.filter(pk=template_id, deleted_at__isnull=True).exists()


class TestUpdatePageTemplatesView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page-template-detail", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, page_template):
        new_name = "New Page Name"

        payload = {"id": page_template.pk, "name": new_name}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page_template.pk), data=payload, format="json")
        page = pages_models.PageTemplate.objects.get(id=response.data["id"])

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
        queryset = pages_models.PageTemplate.objects.filter(project=project.pk)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.PageTemplateSerializer(queryset, many=True).data

    def test_available_for_editor(self, api_client, editor, project, page_template_factory):
        page_template_factory.create_batch(1, project=project, is_available=False)
        page_template_factory.create_batch(2, project=project, is_available=True)

        api_client.force_authenticate(editor)
        response = api_client.get(self.get_url(project.pk))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2


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

    def test_editor_cant_delete_page_template(self, api_client, editor, page_template):
        api_client.force_authenticate(editor)
        response = api_client.delete(self.get_url(page_template.pk))

        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestListCreateSectionView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:sections-list", kwargs=dict(project_pk=pk))

    def test_list_section(self, api_client, admin, section):
        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(section.project_id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1

    def test_list_section_as_editor(self, api_client, editor, section):
        api_client.force_authenticate(editor)
        response = api_client.get(self.get_url(section.project_id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1

    def test_create_section_as_admin(self, api_client, admin, project):
        self.create_section(api_client, admin, project)

    def test_create_section_as_project_editor(self, api_client, editor, project):
        project.editors.add(editor)
        self.create_section(api_client, editor, project)

    def create_section(self, api_client, user, project):
        payload = {"name": "Test Name"}

        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(project.id), data=payload, format="json")
        section = pages_models.Section.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.SectionListCreateSerializer(section).data


class TestUpdateDeleteSectionView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:section-detail", kwargs=dict(pk=pk))

    def test_retrieve_section_as_admin(self, api_client, admin, section):
        self.retrieve_section(api_client, admin, section)

    def test_retrieve_section_as_project_editor(self, api_client, editor, section):
        section.project.editors.add(editor)
        self.retrieve_section(api_client, editor, section)

    def retrieve_section(self, api_client, user, section):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(section.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.SectionDetailSerializer(section).data

    def test_update_section_as_admin(self, api_client, admin, section):
        self.update_section(api_client, admin, section)

    def test_update_section_as_project_editor(self, api_client, editor, section):
        section.project.editors.add(editor)
        self.update_section(api_client, editor, section)

    def update_section(self, api_client, user, section):
        new_name = "New Section Name"
        payload = {"name": new_name}

        api_client.force_authenticate(user)
        response = api_client.patch(self.get_url(section.id), data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK

    def test_delete_section_as_admin(self, api_client, admin, section):
        self.delete_section(api_client, admin, section)

    def test_delete_section_as_project_editor(self, api_client, editor, section):
        section.project.editors.add(editor)
        self.delete_section(api_client, editor, section)

    def delete_section(self, api_client, user, section):
        section_id = section.id
        api_client.force_authenticate(user)
        response = api_client.delete(self.get_url(section.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not pages_models.Section.objects.filter(pk=section_id, deleted_at__isnull=True).exists()

    def test_main_page_update(self, api_client, admin, section, page_factory):
        page_1, page_2 = page_factory.create_batch(2, section=section)

        payload = {"main_page": page_1.id}
        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(section.id), data=payload, format="json")
        section.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert section.main_page == page_1

    def test_main_page_validation(self, api_client, admin, section_factory, page_factory):
        section_1, section_2 = section_factory.create_batch(2)
        page_factory.create_batch(2, section=section_1)
        bad_page = page_factory(section=section_2)

        payload = {"main_page": bad_page.id}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(section_1.id), data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "main_page": [{"message": "Page does not exist in section", "code": "invalid"}]
        }


class TestListCreatePage:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page_list_create", kwargs=dict(section_pk=pk))

    def test_list_pages_as_admin(self, api_client, admin, page):
        self.list_pages(api_client, admin, page)

    def test_list_pages_as_project_editor(self, api_client, editor, page):
        page.project.editors.add(editor)
        self.list_pages(api_client, editor, page)

    def list_pages(self, api_client, user, page):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(page.section_id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1

    def test_create_page_as_admin(self, api_client, admin, project, page_template_factory, section_factory):
        self.create_page(api_client, admin, project, page_template_factory, section_factory)

    def test_create_page_as_project_editor(
        self, api_client, editor, project, page_template_factory, section_factory
    ):
        project.editors.add(editor)
        self.create_page(api_client, editor, project, page_template_factory, section_factory)

    def create_page(self, api_client, user, project, page_template_factory, section_factory):
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

        api_client.force_authenticate(user)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data
        assert page.is_template is False
        assert section.project == page_template.project == page.project

    def test_create_page_with_text_elements(
        self, api_client, admin, project, section_factory, block_template
    ):
        section = section_factory(project=project)

        payload = {
            "name": "Test",
            "section": section.id,
            "display_name": "Display Name",
            "description": "description",
            "keywords": "word;word1",
            "is_public": True,
            "blocks": [
                {
                    "block": block_template.id,
                    "name": "Test Block",
                    "type": "test",
                    "order": 1,
                    "elements": [
                        {
                            "name": "Test Element",
                            "type": "code",
                            "order": 0,
                            "value": "<h1>Test Element</h2>",
                            "params": {},
                        },
                        {
                            "name": "Test Element #2",
                            "type": "markdown",
                            "order": 1,
                            "value": "Test Markdown Element",
                            "params": {},
                        },
                    ],
                },
            ],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data
        assert page.is_template is False

    def test_create_page_with_observable_element(
        self, api_client, admin, project, section_factory, block_template
    ):
        section = section_factory(project=project)

        payload = {
            "name": "Test",
            "section": section.id,
            "display_name": "Display Name",
            "description": "description",
            "keywords": "word;word1",
            "is_public": True,
            "blocks": [
                {
                    "block": block_template.id,
                    "name": "Test Block",
                    "type": "test",
                    "order": 1,
                    "elements": [
                        {
                            "name": "Test Name",
                            "type": "observable_hq",
                            "order": 0,
                            "value": {
                                "observable_user": "user",
                                "observable_notebook": "notebook",
                                "observable_cell": "cell",
                                "observable_params": "params",
                            },
                            "params": {},
                        },
                    ],
                },
            ],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data

    def test_create_page_with_custom_element(
        self, api_client, admin, project, section_factory, block_template
    ):
        section = section_factory(project=project)

        payload = {
            "name": "Test",
            "section": section.id,
            "display_name": "Display Name",
            "description": "description",
            "keywords": "word;word1",
            "is_public": True,
            "blocks": [
                {
                    "block": block_template.id,
                    "name": "Test Block",
                    "type": "test",
                    "order": 1,
                    "elements": [
                        {
                            "name": "Test Name",
                            "type": "custom_element",
                            "order": 0,
                            "value": [
                                {
                                    "order": 0,
                                    "elements": [
                                        {
                                            "name": "Test Element",
                                            "type": "code",
                                            "order": 0,
                                            "value": "<h1>Test Element</h2>",
                                            "params": {},
                                        },
                                        {
                                            "name": "Test Element #2",
                                            "type": "markdown",
                                            "order": 1,
                                            "value": "Test Markdown Element",
                                            "params": {},
                                        },
                                    ],
                                },
                                {
                                    "order": 1,
                                    "elements": [
                                        {
                                            "name": "Test Element",
                                            "type": "code",
                                            "order": 0,
                                            "value": "<h1>Test Element</h2>",
                                            "params": {},
                                        },
                                        {
                                            "name": "Test Element #2",
                                            "type": "markdown",
                                            "order": 1,
                                            "value": "Test Markdown Element",
                                            "params": {},
                                        },
                                    ],
                                },
                            ],
                            "params": {},
                        },
                    ],
                },
            ],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data

    def test_create_page_with_video_element(
        self, api_client, admin, project, section_factory, block_template
    ):
        section = section_factory(project=project)

        payload = {
            "name": "Test",
            "section": section.id,
            "display_name": "Display Name",
            "description": "description",
            "keywords": "word;word1",
            "is_public": True,
            "blocks": [
                {
                    "block": block_template.id,
                    "name": "Test Block",
                    "type": "test",
                    "order": 1,
                    "elements": [
                        {
                            "name": "Test Element",
                            "type": "embed_video",
                            "order": 0,
                            "value": "https://test-video.url.com/video",
                            "params": {},
                        }
                    ],
                },
            ],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data
        assert page.is_template is False

    def test_create_page_with_state_element(
        self, api_client, admin, project, section_factory, block_template, state
    ):
        section = section_factory(project=project)

        payload = {
            "name": "Test",
            "section": section.id,
            "display_name": "Display Name",
            "description": "description",
            "keywords": "word;word1",
            "is_public": True,
            "blocks": [
                {
                    "block": block_template.id,
                    "name": "Test Block",
                    "type": "test",
                    "order": 1,
                    "elements": [
                        {
                            "name": "Test Element",
                            "type": "state",
                            "order": 0,
                            "value": state.id,
                            "params": {},
                        }
                    ],
                },
            ],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(section.id), data=payload, format="json")
        page = pages_models.Page.objects.get(id=response.data["id"])

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == page_serializer.PageSerializer(page).data
        assert page.is_template is False


class TestUpdateDeletePageView:
    @staticmethod
    def get_url(pk):
        return reverse("pages:page-detail", kwargs=dict(pk=pk))

    def test_retrieve_page_as_admin(self, api_client, admin, page):
        self.retrieve_page(api_client, admin, page)

    def test_retrieve_page_as_project_editor(self, api_client, editor, page):
        page.project.editors.add(editor)
        self.retrieve_page(api_client, editor, page)

    def retrieve_page(self, api_client, user, page):
        api_client.force_authenticate(user)
        response = api_client.get(self.get_url(page.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == page_serializer.PageSerializer(page).data

    def test_update_page_as_admin(self, api_client, admin, page):
        self.update_page(api_client, admin, page)

    def test_update_page_as_project_editor(self, api_client, editor, page):
        page.project.editors.add(editor)
        self.update_page(api_client, editor, page)

    def update_page(self, api_client, user, page):
        new_name = "New Page Name"
        payload = {"name": new_name}

        api_client.force_authenticate(user)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        page.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert page.name == new_name

    def test_update_page_block(self, api_client, admin, page, block_template, page_block_factory):
        page_block = page_block_factory(block=block_template, page=page)
        new_block_name = "New Block Name"
        payload = {"blocks": [{"id": page_block.id, "name": new_block_name}]}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        page.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert page.pageblock_set.count() == 1
        assert page.pageblock_set.get(pk=page_block.id).name == new_block_name

    def test_update_page_block_element(
        self, api_client, admin, page, block_template, page_block_factory, page_block_element_factory
    ):
        page_block = page_block_factory(block=block_template, page=page)
        page_block_element = page_block_element_factory(block=page_block)
        new_element_name = "New Element Name"
        payload = {
            "blocks": [
                {"id": page_block.id, "elements": [{"id": page_block_element.id, "name": new_element_name}]}
            ]
        }

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        element = page.pageblock_set.get(pk=page_block.id).elements.get(pk=page_block_element.id)

        assert response.status_code == status.HTTP_200_OK
        assert page.pageblock_set.count() == 1
        assert element.name == new_element_name

    def test_delete_page_as_admin(self, api_client, admin, page):
        self.delete_page(api_client, admin, page)

    def test_delete_page_as_project_editor(self, api_client, editor, page):
        page.project.editors.add(editor)
        self.delete_page(api_client, editor, page)

    def delete_page(self, api_client, user, page):
        page_id = page.id
        api_client.force_authenticate(user)
        response = api_client.delete(self.get_url(page.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not pages_models.Page.objects.filter(pk=page_id, deleted_at__isnull=True).exists()

    def test_delete_page_block(self, api_client, admin, page, block_template, page_block_factory):
        page_block = page_block_factory(block=block_template, page=page)

        payload = {"delete_blocks": [page_block.id]}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(page.id), data=payload, format="json")
        page.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert page.pageblock_set.count() == 0


class TestCopyBlockTemplate:
    @staticmethod
    def get_url(pk):
        return reverse("pages:blocktemplate-copy-block", kwargs=dict(pk=pk))

    @pytest.mark.freeze_time("2020-01-02 10:00:00")
    def test_copy_as_admin(self, admin, api_client, block_template_factory, block_template_element_factory):
        block = block_template_factory()
        block_template_element_factory.create_batch(4, template=block)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(block.id), format="json")
        copied_block = pages_models.BlockTemplate.objects.get(pk=response.data["id"])
        copied_block_elements = copied_block.elements.all().order_by("name")
        block_elements = block.elements.all().order_by("name")

        assert response.status_code == status.HTTP_200_OK
        assert copied_block.name == f"Block Template ID #{block.id} copy(2020-01-02, 10:00:00.000000)"
        assert len(block_elements) == len(copied_block_elements)
        assert block_elements[0].id != copied_block_elements[0].id
        assert block_elements[0].type == copied_block_elements[0].type
        assert block_elements[0].name == copied_block_elements[0].name
        assert copied_block_elements[0].template == copied_block

    def test_copy_not_allowed_as_editor(
        self, editor, api_client, block_template_factory, block_template_element_factory
    ):
        block = block_template_factory()
        block_template_element_factory.create_batch(4, template=block)

        api_client.force_authenticate(editor)
        response = api_client.post(self.get_url(block.id), format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN
