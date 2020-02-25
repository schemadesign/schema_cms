import factory

from schemacms.users.tests.factories import UserFactory
from schemacms.utils import test as utils_test


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.Project"
        django_get_or_create = ("slug",)

    title = factory.Sequence(lambda n: f"test title {n}")
    slug = factory.Faker("slug")
    owner = factory.SubFactory(UserFactory)
    description = factory.Faker("text")

    @factory.post_generation
    def editors(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.editors.add(*extracted)


class FolderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.Folder"

    project = factory.SubFactory(ProjectFactory)
    name = factory.Faker("text", max_nb_chars=25)
    created_by = factory.SubFactory(UserFactory)


class PageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.Page"

    folder = factory.SubFactory(FolderFactory)
    title = factory.Faker("text", max_nb_chars=25)
    created_by = factory.SubFactory(UserFactory)


class BlockFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.Block"

    page = factory.SubFactory(PageFactory)
    name = factory.Faker("text", max_nb_chars=25)
    content = factory.Faker("text", max_nb_chars=25)


class BlockImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.BlockImage"

    block = factory.SubFactory(BlockFactory)
    image = factory.django.ImageField(filename="test.png", from_func=utils_test.make_image)
