import factory

from schemacms.datasources.tests.factories import DataSourceFactory
from schemacms.projects.tests.factories import ProjectFactory
from schemacms.users.tests.factories import UserFactory


class StateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "states.State"

    project = factory.SubFactory(ProjectFactory)
    datasource = factory.SubFactory(DataSourceFactory)
    name = factory.Faker("text", max_nb_chars=50)
    description = factory.Faker("text", max_nb_chars=150)
    author = factory.SubFactory(UserFactory)
