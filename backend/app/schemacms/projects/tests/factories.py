import factory

from schemacms.projects import constants as project_constants
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


class DataSourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.DataSource"

    name = factory.Faker("text", max_nb_chars=project_constants.DATASOURCE_NAME_MAX_LENGTH)
    project = factory.SubFactory(ProjectFactory)
    type = project_constants.DataSourceType.FILE
    file = factory.django.FileField(filename="test.csv", from_func=utils_test.make_csv)

    class Params:
        draft = factory.Trait(type=project_constants.DataSourceStatus.DRAFT)

    @factory.post_generation
    def meta_data_update(self, create, extracted, **kwargs):
        if self.file:
            self.update_meta()


class DataSourceMetaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.DataSourceMeta"
        django_get_or_create = ("datasource",)

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    items = factory.Faker("pyint", min_value=0, max_value=9999)
    fields = factory.Faker("pyint", min_value=0, max_value=20)
