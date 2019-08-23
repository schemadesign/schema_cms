import factory

from schemacms.users.tests.factories import UserFactory


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'projects.Project'
        django_get_or_create = ('title',)

    title = factory.Sequence(lambda n: f'test title {n}')
    owner = factory.SubFactory(UserFactory)
    description = factory.Faker('text')
