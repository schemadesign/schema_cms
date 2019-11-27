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

    def test_annotate_pages_count(
        self, django_assert_num_queries, faker, project, directory_factory, page_factory
    ):
        expected = faker.pyint(min_value=0, max_value=3)
        directory = directory_factory(project=project)
        page_factory.create_batch(expected, directory=directory)

        project_refreshed = models.Project.objects.all().annotate_pages_count().get(pk=project.pk)

        with django_assert_num_queries(0):
            assert project_refreshed.pages_count == expected
