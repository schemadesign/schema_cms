import pytest

from schemacms.projects import models


pytestmark = [pytest.mark.django_db]


class TestProjectQuerySet:
    def test_annotate_data_source_count(self, django_assert_num_queries, faker, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)

        project_refreshed = models.Project.objects.all().annotate_data_source_count().get(pk=project.pk)

        with django_assert_num_queries(0):
            assert project_refreshed.data_source_count == expected

    def test_annotate_templates_count(
        self, django_assert_num_queries, faker, project, block_template_factory, page_template_factory
    ):
        expected_block_templates = faker.pyint(min_value=0, max_value=3)
        expected_page_templates = faker.pyint(min_value=0, max_value=3)
        block_template_factory.create_batch(expected_block_templates, project=project)
        page_template_factory.create_batch(expected_page_templates, project=project)

        project_refreshed = models.Project.objects.all().annotate_templates_count().get(pk=project.pk)

        with django_assert_num_queries(0):
            assert project_refreshed.block_templates == expected_block_templates
            assert project_refreshed.page_templates == expected_page_templates
