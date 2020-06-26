import pytest

from ..constants import ElementType


pytestmark = [pytest.mark.django_db]


class TestTemplateModelMethods:
    def test_project_info_property(self, project, block_template_factory, page_template_factory):
        block_template = block_template_factory(project=project)
        page_template = page_template_factory(project=project)

        project_info = {"id": project.id, "title": project.title, "domain": project.domain}

        assert block_template.project_info == project_info
        assert page_template.project_info == project_info


class TestPageBlockClone:
    def test_clone_page_block(self, page_factory, page_block_factory):
        page_1 = page_factory()
        page_2 = page_factory()

        page_block = page_block_factory(page=page_1)
        copied_block = page_block.make_clone(attrs={"page": page_2})

        assert copied_block.id != page_block.id
        assert copied_block.block == page_block.block
        assert copied_block.name == copied_block.name
        assert copied_block.page == page_2

    def test_clone_page_block_not_copy_elements(
        self, page_factory, page_block_factory, page_block_element_factory
    ):
        page_1 = page_factory()
        page_2 = page_factory()

        page_block = page_block_factory(page=page_1)
        page_block_element_factory.create_batch(3, block=page_block)
        copied_block = page_block.make_clone(attrs={"page": page_2})

        assert page_block.elements.count() == 3
        assert copied_block.elements.count() != page_block.elements.count()


class TestPageBlockElementClone:
    def test_clone_observable_element(
        self, page_block_factory, page_block_element_factory, observable_element
    ):
        block_1 = page_block_factory()
        block_2 = page_block_factory()

        element = page_block_element_factory(
            block=block_1, type=ElementType.OBSERVABLE_HQ, observable_hq=observable_element
        )

        copied_element = element.clone(block_2)

        copied_observable = copied_element.observable_hq

        assert copied_element.id != element.id
        assert copied_element.type == element.type
        assert copied_element.block != element.block
        assert copied_element.observable_hq != observable_element
        assert copied_observable.observable_user == observable_element.observable_user
        assert copied_observable.observable_notebook == observable_element.observable_notebook
        assert copied_observable.observable_cell == observable_element.observable_cell
        assert copied_observable.observable_params == observable_element.observable_params

    @pytest.mark.parametrize(
        "element_type", ["plain_text", "code", "connection", "markdown", "internal_connection"]
    )
    def test_clone_text_elements(self, page_block_factory, page_block_element_factory, element_type):
        block_1 = page_block_factory()
        block_2 = page_block_factory()

        element = page_block_element_factory(block=block_1, type=element_type, **{element_type: "Test"})

        copied_element = element.clone(block_2)

        assert copied_element.id != element.id
        assert copied_element.type == element.type
        assert copied_element.block != element.block
        assert getattr(copied_element, element_type) == getattr(element, element_type)

    def test_clone_custom_element(
        self, page_block_factory, page_block_element_factory, custom_element_set_factory
    ):
        block_1 = page_block_factory()
        block_2 = page_block_factory()

        element = page_block_element_factory(block=block_1, type=ElementType.CUSTOM_ELEMENT)

        custom_element_set_1 = custom_element_set_factory(custom_element=element)
        custom_element_set_2 = custom_element_set_factory(custom_element=element)

        page_block_element_factory.create_batch(3, block=block_1, custom_element_set=custom_element_set_1)
        page_block_element_factory.create_batch(2, block=block_1, custom_element_set=custom_element_set_2)

        copied_element = element.clone(block_2)
        copied_element_sets = copied_element.elements_sets.all()
        element.refresh_from_db()
        element_sets = element.elements_sets.all()

        assert copied_element.id != element.id
        assert copied_element.type == element.type
        assert copied_element.block != element.block
        assert len(copied_element_sets) == len(element_sets)
        assert copied_element_sets[0].elements.count() == 3
        assert element.elements_sets.all()[1].elements.count() == 2
        assert element_sets[0].elements.count() == 3
        assert element_sets[1].elements.count() == 2
