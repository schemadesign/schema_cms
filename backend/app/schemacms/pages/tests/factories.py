import factory

from schemacms.users.tests.factories import UserFactory
from schemacms.pages import constants
from schemacms.projects.tests.factories import ProjectFactory


class SectionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.Section"

    project = factory.SubFactory(ProjectFactory)
    name = factory.Faker("text", max_nb_chars=constants.SECTION_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)


class PageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.Page"

    project = factory.SubFactory(ProjectFactory)
    section = factory.SubFactory(SectionFactory, project=project)
    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)
    display_name = factory.Faker("text", max_nb_chars=constants.PAGE_DISPLAY_NAME_MAX_LENGTH)
    is_template = False
    is_public = False

    @factory.post_generation
    def template(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.template = PageTemplateFactory(project=self.project)


class BlockTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.BlockTemplate"

    project = factory.SubFactory(ProjectFactory)
    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)


class BlockTemplateElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.BlockTemplateElement"

    name = factory.Faker("text", max_nb_chars=constants.ELEMENT_NAME_MAX_LENGTH)
    template = factory.SubFactory(BlockTemplateFactory)


class PageTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.Page"

    project = factory.SubFactory(ProjectFactory)
    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)
    is_template = True


class PageBlockFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.PageBlock"

    block = factory.SubFactory(BlockTemplateFactory)
    page = factory.SubFactory(PageFactory)
    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)


class PageBlockElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.PageBlockElement"

    block = factory.SubFactory(PageBlockFactory)
    name = factory.Faker("text", max_nb_chars=constants.ELEMENT_NAME_MAX_LENGTH)
    type = constants.ElementType.CODE


class PageBlockObservableElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.PageBlockObservableElement"

    observable_user = factory.Faker("text", max_nb_chars=1000)
    observable_notebook = factory.Faker("text", max_nb_chars=1000)
    observable_cell = factory.Faker("text", max_nb_chars=1000)
    observable_params = factory.Faker("text", max_nb_chars=1000)


class CustomElementSetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.CustomElementSet"

    block = factory.SubFactory(PageBlockElementFactory)
