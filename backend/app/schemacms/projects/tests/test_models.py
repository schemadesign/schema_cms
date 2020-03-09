import pytest

from schemacms.projects import models as project_models


pytestmark = [pytest.mark.django_db]


class TestProject:
    def test_data_source_count(self, faker, project, data_source_factory):
        expected = faker.pyint(min_value=0, max_value=3)
        data_source_factory.create_batch(expected, project=project)

        assert project.data_source_count == expected

    def test_meta_file_serialization(self, admin, project_factory, data_source_factory):
        project = project_factory(owner=admin)
        ds = data_source_factory(project=project)

        project.refresh_from_db()
        ret = project.meta_file_serialization()

        assert ret == {
            "id": project.id,
            "meta": {
                "title": project.title,
                "description": project.description,
                "owner": admin.get_full_name(),
                "created": project.created.isoformat(),
                "updated": project.modified.isoformat(),
            },
            "data_sources": [{"id": ds.id, "name": ds.name, "type": ds.type}],
            "pages": [],
        }

    def test_get_projects_for_user(self, faker, project_factory, user):
        projects = project_factory.create_batch(3, editors=[user])
        assert len(projects) == len(project_models.Project.get_projects_for_user(user))
        assert projects == list(project_models.Project.get_projects_for_user(user).order_by("id"))
