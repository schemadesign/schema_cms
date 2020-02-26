import operator

import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.states.models import TagsList, Tag, State
from schemacms.states.serializers import TagsListSerializer, StateSerializer, TagsListDetailSerializer
from schemacms.utils import error

pytestmark = [pytest.mark.django_db]


def multisort(xs, specs):
    for key, reverse_ in reversed(specs):
        xs.sort(key=operator.attrgetter(key), reverse=reverse_)
    return xs


class TestTagsListsCreateView:
    def test_response(self, api_client, admin, tags_list_factory, data_source):
        tags_list_factory.create_batch(2, datasource=data_source, is_active=True)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2
        assert response.data["results"] == TagsListSerializer(data_source.list_of_tags, many=True).data
        assert response.data["project"] == {"id": data_source.project.id, "title": data_source.project.title}

    def test_create_without_tags(self, api_client, admin, data_source):
        payload = dict(name="test")

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        tags_list_id = response.data["id"]
        tags_list = TagsList.objects.get(pk=tags_list_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data == TagsListSerializer(tags_list).data

    def test_create_with_tags(self, api_client, admin, data_source):
        payload = {
            "name": "withTags",
            "is_active": True,
            "tags": [
                {"value": "tag1", "exec_order": 0},
                {"value": "tag2", "exec_order": 1},
                {"value": "tag1", "exec_order": 2},
            ],
        }

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        tags_list_id = response.data["id"]
        tags_list = TagsList.objects.get(pk=tags_list_id)

        assert response.status_code == status.HTTP_201_CREATED
        assert len(response.data["tags"]) == 3
        assert response.data["tags"] == TagsListSerializer(tags_list).data["tags"]

    def test_unique_key_validation(self, api_client, admin, tags_list_factory, data_source):
        tags_list = tags_list_factory(datasource=data_source)
        payload = dict(name=tags_list.name)

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "name": [
                error.Error(
                    message="TagsList with this name already exist in data source.",
                    code="tagsListNameNotUnique",
                ).data
            ]
        }

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-tags-lists", kwargs=dict(pk=pk))


class TestTagsListDetailView:
    def test_response(self, api_client, admin, tags_list):

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(tags_list.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == TagsListDetailSerializer(instance=tags_list).data

    def test_update(self, api_client, admin, tags_list):
        new_name = "newName"
        payload = dict(name=new_name)

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(tags_list.id), data=payload, format="json")
        tags_list.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert tags_list.name == new_name
        assert response.data == TagsListDetailSerializer(instance=tags_list).data

    def test_delete(self, api_client, admin, tags_list):
        api_client.force_authenticate(admin)
        response = api_client.delete(self.get_url(tags_list.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Tag.objects.all().filter(pk=tags_list.id).exists()

    @staticmethod
    def get_url(pk):
        return reverse("states:tagslist-detail", kwargs=dict(pk=pk))


class TestSetTagsListView:
    def test_response(self, api_client, admin, data_source, tags_list_factory):
        tags_list_1 = tags_list_factory(datasource=data_source, is_active=False)
        tags_list_2 = tags_list_factory(datasource=data_source, is_active=True)
        tags_list_1_old_status = tags_list_1.is_active
        tags_list_2_old_status = tags_list_2.is_active
        payload = {"active": [tags_list_1.id], "inactive": [tags_list_2.id]}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")
        tags_list_1.refresh_from_db()
        tags_list_2.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert tags_list_1_old_status != tags_list_1.is_active
        assert tags_list_2_old_status != tags_list_2.is_active

    @staticmethod
    def get_url(pk):
        return reverse("datasources:datasource-set-tags-lists", kwargs=dict(pk=pk))


class TestStateCreateListView:
    @staticmethod
    def get_url(pk):
        return reverse("projects:project-states", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, project, data_source, state_factory):
        state_factory.create_batch(2, project=project, datasource=data_source)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(project.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_create(self, api_client, admin, project, data_source):
        payload = {"datasource": data_source.id, "name": "testState", "description": "test state description"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(project.id), data=payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert State.objects.filter(pk=response.data["id"]).exists()


class TestStateDetailView:
    @staticmethod
    def get_url(pk):
        return reverse("states:state-detail", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, project, data_source, state_factory):
        state = state_factory(project=project, datasource=data_source)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(state.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == StateSerializer(instance=state).data

    def test_update_state_tags(self, api_client, admin, state, tag_factory, tags_list_factory):
        tags_list = tags_list_factory(datasource=state.datasource)
        tags = tag_factory.create_batch(4, tags_list=tags_list)
        list_of_tags_ids = [tag.id for tag in tags]
        payload = {"active_tags": list_of_tags_ids}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(state.id), data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["active_tags"] == list_of_tags_ids

    def test_update_state_filters(self, api_client, admin, state, filter_):
        payload = {"filters": [{"filter": filter_.id, "values": [123, 1233]}]}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(state.id), data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["filters"]) == 1
