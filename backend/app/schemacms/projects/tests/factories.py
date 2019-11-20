import factory

from schemacms.projects import constants as project_constants
from schemacms.users.tests.factories import UserFactory
from schemacms.utils import test as utils_test


class BaseMetaDataFactory(factory.django.DjangoModelFactory):
    items = factory.Faker("pyint", min_value=0, max_value=9999)
    fields = factory.Faker("pyint", min_value=0, max_value=20)

    class Meta:
        abstract = True


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

    @factory.post_generation
    def meta_data_update(self, create, extracted, **kwargs):
        if self.file:
            self.update_meta()


class DataSourceMetaFactory(BaseMetaDataFactory):
    class Meta:
        model = "projects.DataSourceMeta"
        django_get_or_create = ("datasource",)

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)


class ScriptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.WranglingScript"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    name = factory.Faker("text", max_nb_chars=project_constants.SCRIPT_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)
    file = factory.django.FileField(filename="test.py", from_func=utils_test.make_script)


class JobFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.DataSourceJob"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    # TODO(khanek) Find a way to generate result path without job id on creation
    # result = factory.django.FileField(filename="result.csv", from_func=utils_test.make_csv)
    source_file_path = factory.SelfAttribute(".datasource.file.name")
    source_file_version = factory.Faker("uuid4")


class JobMetaFactory(BaseMetaDataFactory):
    job = factory.SubFactory(JobFactory)

    class Meta:
        model = "projects.DataSourceJobMetaData"


class JobStepFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.DataSourceJobStep"

    datasource_job = factory.SubFactory(JobFactory)
    script = factory.SubFactory(ScriptFactory)


class FilterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "projects.Filter"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    name = factory.Faker("text", max_nb_chars=25)
