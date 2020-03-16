import factory

from schemacms.users.tests.factories import UserFactory
from schemacms.pages import constants
from schemacms.projects.tests.factories import ProjectFactory


class BlockTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.Block"

    project = factory.SubFactory(ProjectFactory)
    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)
    is_template = True


class BlockTemplateElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.BlockElement"

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
    page = factory.SubFactory(BlockTemplateFactory)
    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
