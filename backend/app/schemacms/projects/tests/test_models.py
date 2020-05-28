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
