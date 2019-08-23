import factory

from schemacms.users.tests.factories import UserFactory


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
            for editor in extracted:
                self.editors.add(editor)
