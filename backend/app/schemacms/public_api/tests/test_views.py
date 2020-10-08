import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.public_api.serializers import PAProjectSerializer
from schemacms.projects import models as projects_models
from schemacms.pages import constants as pa_constants

pytestmark = [pytest.mark.django_db]


class TestPATagCategoryListView:
    @staticmethod
    def get_url(pk):
        return reverse("public_api:pa-tags-list", kwargs=dict(project_pk=pk))

    def test_response(self, api_client, project, tag_category_factory, tag_factory):
        category = tag_category_factory(project=project, type={"content": True, "dataset": True})
        tag_factory(value="tag_value", category=category)

        response = api_client.get(self.get_url(project.id))

        assert_data = {
            "id": category.id,
            "name": category.name,
            "is_single_select": category.is_single_select,
            "type": {"content": True, "dataset": True},
            "tags": ["tag_value"],
        }

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0] == assert_data


class TestPAProjectListView:
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


class TestPASectionDetailView:
    @staticmethod
    def get_url(pk):
        return reverse("public_api:pa-sections-detail", kwargs={"pk": pk})

    def test_response_for_non_authenticate_user(self, api_client, section):
        response = api_client.get(self.get_url(section.id))

        expected_data = {
            "meta": {
                "id": section.id,
                "name": section.name,
                "slug": section.slug,
                "project": section.project_id,
                "created_by": section.created_by.get_full_name() if section.created_by else "",
            },
            "pages": [],
            "drafts": [],
        }

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_patch_not_allowed(self, api_client, section):
        response = api_client.patch(self.get_url(section.id), data={})

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_put_not_allowed(self, api_client, section):
        response = api_client.put(self.get_url(section.id), data={})

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_delete_not_allowed(self, api_client, section):
        response = api_client.delete(self.get_url(section.id))

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


class TestPAPageViewSet:
    @staticmethod
    def generate_assert_data(page):
        return {
            "id": page.draft_version.id if hasattr(page, "draft_version") else page.id,
            "name": page.name,
            "template": page.template,
            "slug": page.slug,
            "display_name": page.display_name,
            "description": page.description,
            "keywords": page.keywords,
            "section": {"id": page.section.id, "name": page.section.name, "slug": page.section.slug},
            "created_by": page.created_by.get_full_name() if page.created_by else "",
            "updated": page.modified.strftime("%Y-%m-%d"),
            "tags": {},
            "blocks": [],
        }

    def test_response(self, api_client, page_factory):
        pages = sorted(page_factory.create_batch(3, is_public=True), key=lambda x: x.created)

        for page in pages:
            published_version = page.copy_page(
                attrs={"is_draft": False, "state": pa_constants.PageState.PUBLISHED}
            )

            page.published_version = published_version
            page.save()

        response = api_client.get(reverse("public_api:pa-pages-list"))

        page = pages[1].published_version

        assert_data = self.generate_assert_data(page)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3
        assert response.data["results"][1] == assert_data

    def test_detail_response(self, api_client, page_factory):
        page = page_factory(is_public=True)

        published_version = page.copy_page(
            attrs={"is_draft": False, "state": pa_constants.PageState.PUBLISHED}
        )

        page.published_version = published_version
        page.save()

        response = api_client.get(reverse("public_api:pa-pages-detail", kwargs={"pk": page.id}))

        assert_data = self.generate_assert_data(published_version)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == assert_data

    def test_html_response(self, api_client, page_factory, page_block_factory, page_block_element_factory):
        page = page_factory(is_public=True)
        page_block = page_block_factory(page=page, order=0)
        page_block_element_factory(
            block=page_block, type=pa_constants.ElementType.PLAIN_TEXT, order=0, plain_text="Test"
        )
        page_block_element_factory(
            block=page_block, type=pa_constants.ElementType.CODE, order=1, code="Test Code"
        )

        published_version = page.copy_page(
            attrs={"is_draft": False, "state": pa_constants.PageState.PUBLISHED}
        )

        page.published_version = published_version
        page.save()

        response = api_client.get(reverse("public_api:pa-pages-html", kwargs={"pk": page.id}))

        assert response.status_code == status.HTTP_200_OK

    def test_draft_response(self, api_client, page_factory):
        page = page_factory(is_public=True)

        published_version = page.copy_page(
            attrs={"is_draft": False, "state": pa_constants.PageState.PUBLISHED}
        )

        page.published_version = published_version
        page.name = "New Name"
        page.save()

        response_draft = api_client.get(reverse("public_api:pa-pages-draft", kwargs={"pk": page.id}))
        response_published = api_client.get(reverse("public_api:pa-pages-detail", kwargs={"pk": page.id}))

        assert_data = self.generate_assert_data(page)

        assert response_draft.status_code == status.HTTP_200_OK
        assert response_draft.data == assert_data
        assert response_published.data != assert_data
