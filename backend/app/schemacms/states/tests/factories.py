import factory

from schemacms.datasources.tests.factories import DataSourceFactory
from schemacms.users.tests.factories import UserFactory
from schemacms.tags.tests.factories import TagCategoryFactory


class StateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "states.State"

    datasource = factory.SubFactory(DataSourceFactory)
    name = factory.Faker("text", max_nb_chars=50)
    description = factory.Faker("text", max_nb_chars=150)
    author = factory.SubFactory(UserFactory)


class StateTagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "states.StateTag"

    state = factory.SubFactory(StateFactory)
    category = factory.SubFactory(TagCategoryFactory)
    value = factory.Faker("text", max_nb_chars=150)
