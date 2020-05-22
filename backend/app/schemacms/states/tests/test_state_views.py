import operator

import pytest
from django.urls import reverse
from rest_framework import status

from schemacms.states.models import State
from schemacms.states.serializers import StateSerializer

pytestmark = [pytest.mark.django_db]


def multisort(xs, specs):
    for key, reverse_ in reversed(specs):
        xs.sort(key=operator.attrgetter(key), reverse=reverse_)
    return xs


class TestStateCreateListView:
    @staticmethod
    def get_url(pk):
        return reverse("states:state-list", kwargs=dict(datasource_pk=pk))

    def test_response(self, api_client, admin, data_source, state_factory):
        state_factory.create_batch(2, datasource=data_source)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(data_source.id))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_create(self, api_client, admin, data_source):
        payload = {"name": "testState", "description": "test state description"}

        api_client.force_authenticate(admin)
        response = api_client.post(self.get_url(data_source.id), data=payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert State.objects.filter(pk=response.data["id"]).exists()


class TestStateDetailView:
    @staticmethod
    def get_url(pk):
        return reverse("states:state-detail", kwargs=dict(pk=pk))

    def test_response(self, api_client, admin, data_source, state_factory):
        state = state_factory(datasource=data_source)

        api_client.force_authenticate(admin)
        response = api_client.get(self.get_url(state.id))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"] == StateSerializer(instance=state).data

    def test_update_state_tags(self, api_client, admin, project, state, tag_factory, tag_category_factory):
        tag_category = tag_category_factory(project=project)
        tags = tag_factory.create_batch(4, category=tag_category)
        list_of_tags_ids = [{"category": tag.category.id, "value": tag.value} for tag in tags]
        payload = {"tags": list_of_tags_ids}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(state.id), data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["tags"] == StateSerializer(state).data["tags"]

    def test_update_state_filters(self, api_client, admin, state, filter_):
        payload = {"filters": [{"filter": filter_.id, "values": [123, 1233]}]}

        api_client.force_authenticate(admin)
        response = api_client.patch(self.get_url(state.id), data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["filters"]) == 1
