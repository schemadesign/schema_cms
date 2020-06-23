import pytest


pytestmark = [pytest.mark.django_db]


class TestStateModel:
    def test_get_tags(self, state_factory, state_tag_factory, tag_category_factory):
        state = state_factory()
        category_1 = tag_category_factory(name="test1")
        category_2 = tag_category_factory(name="test2")

        state_tag_factory(state=state, category=category_1, value="tag_1")
        state_tag_factory(state=state, category=category_2, value="tag_2")

        expected = {category_1.name: ["tag_1"], category_2.name: ["tag_2"]}
        assert len(state.get_tags()) == 2
        assert state.get_tags() == expected

    def test_formatted_meta(self, state):
        assert state.formatted_meta == {
            "id": state.id,
            "name": state.name,
            "datasource": state.datasource.formatted_meta,
            "description": state.description,
            "source_url": state.source_url,
            "author": state.author.get_full_name(),
        }
