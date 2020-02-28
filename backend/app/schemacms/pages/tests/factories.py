import factory

from schemacms.users.tests.factories import UserFactory
from schemacms.pages import constants


class BlockTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.BlockTemplate"

    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)


class BlockTemplateElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.BlockTemplateElement"

    name = factory.Faker("text", max_nb_chars=constants.ELEMENT_NAME_MAX_LENGTH)
    template = factory.SubFactory(BlockTemplateFactory)


class PageTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "pages.PageTemplate"

    name = factory.Faker("text", max_nb_chars=constants.TEMPLATE_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)
