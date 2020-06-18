import pytest

from schemacms.projects import models as project_models


pytestmark = [pytest.mark.django_db]


class TestProject:
    def test_data_source_count(self, faker, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)

        assert project.data_source_count == expected

    def test_get_projects_for_user(self, faker, project_factory, user):
        projects = project_factory.create_batch(3, editors=[user])
        assert len(projects) == len(project_models.Project.get_projects_for_user(user))
        assert projects == list(project_models.Project.get_projects_for_user(user).order_by("id"))

    def test_templates_count(
        self,
        django_assert_num_queries,
        faker,
        project,
        block_template_factory,
        page_template_factory,
        tag_category_factory,
    ):
        expected_block_templates = faker.pyint(min_value=0, max_value=3)
        expected_page_templates = faker.pyint(min_value=0, max_value=3)
        expected_tags_templates = faker.pyint(min_value=0, max_value=3)
        block_template_factory.create_batch(expected_block_templates, project=project)
        page_template_factory.create_batch(expected_page_templates, project=project)
        tag_category_factory.create_batch(expected_tags_templates, project=project)

        project = project_models.Project.objects.get(pk=project.pk)

        assert project.templates_count == {
            "blocks": expected_block_templates,
            "pages": expected_page_templates,
            "tags": expected_tags_templates,
            "states": 0,
        }
