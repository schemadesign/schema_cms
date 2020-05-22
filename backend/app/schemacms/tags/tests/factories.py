import factory

from schemacms.projects.tests.factories import ProjectFactory


class TagCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "tags.TagCategory"

    project = factory.SubFactory(ProjectFactory)
    name = factory.Faker("text", max_nb_chars=25)
    is_available = False


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "tags.Tag"

    category = factory.SubFactory(TagCategoryFactory)
    value = factory.Faker("text", max_nb_chars=25)
