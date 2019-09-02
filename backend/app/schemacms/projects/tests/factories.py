import factory

from schemacms.users.tests.factories import UserFactory
from schemacms.conftests.utils import make_csv


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'projects.Project'
        django_get_or_create = ('slug',)

    title = factory.Sequence(lambda n: f'test title {n}')
    slug = factory.Faker('slug')
    owner = factory.SubFactory(UserFactory)
    description = factory.Faker('text')

    @factory.post_generation
    def editors(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.editors.add(*extracted)


class DataSourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'projects.DataSource'

    project = factory.SubFactory(ProjectFactory)
    file = factory.django.FileField(filename='test.csv', data=make_csv().getvalue())


class DataSourceMetaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'projects.DataSourceMeta'

    datasource = factory.SubFactory(DataSourceFactory)
