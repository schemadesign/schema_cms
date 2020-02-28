import pytest


pytestmark = [pytest.mark.django_db]


class TestTemplateModelMethods:
    def test_project_info_property(self, project, block_template_factory, page_template_factory):
        block_template = block_template_factory(project=project)
        page_template = page_template_factory(project=project)

        project_info = {"id": project.id, "title": project.title}

        assert block_template.project_info == project_info
        assert page_template.project_info == project_info
