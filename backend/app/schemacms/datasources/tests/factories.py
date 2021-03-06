import factory

from schemacms.users.tests.factories import UserFactory
from schemacms.projects.tests.factories import ProjectFactory
from schemacms.datasources import constants
from schemacms.utils import test as utils_test


class BaseMetaDataFactory(factory.django.DjangoModelFactory):
    items = factory.Faker("pyint", min_value=0, max_value=9999)
    fields = factory.Faker("pyint", min_value=0, max_value=20)

    class Meta:
        abstract = True


class DataSourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "datasources.DataSource"

    name = factory.Faker("text", max_nb_chars=constants.DATASOURCE_NAME_MAX_LENGTH)
    project = factory.SubFactory(ProjectFactory)
    type = constants.DataSourceType.FILE
    file = factory.django.FileField(filename="test.csv", from_func=utils_test.make_csv)
    created_by = factory.SubFactory(UserFactory)


class DataSourceMetaFactory(BaseMetaDataFactory):
    class Meta:
        model = "datasources.DataSourceMeta"
        django_get_or_create = ("datasource",)

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)


class ScriptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "datasources.WranglingScript"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    name = factory.Faker("text", max_nb_chars=constants.SCRIPT_NAME_MAX_LENGTH)
    created_by = factory.SubFactory(UserFactory)
    file = factory.django.FileField(filename="test.py", from_func=utils_test.make_script)


class JobFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "datasources.DataSourceJob"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    source_file_path = factory.SelfAttribute(".datasource.file.name")
    source_file_version = factory.Faker("uuid4")


class JobMetaFactory(BaseMetaDataFactory):
    job = factory.SubFactory(JobFactory)

    class Meta:
        model = "datasources.DataSourceJobMetaData"


class JobStepFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "datasources.DataSourceJobStep"

    datasource_job = factory.SubFactory(JobFactory)
    script = factory.SubFactory(ScriptFactory)


class FilterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "datasources.Filter"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    name = factory.Faker("text", max_nb_chars=25)


class DescriptionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "datasources.DataSourceDescription"

    datasource = factory.SubFactory(DataSourceFactory, meta_data=None)
    data = [{"key": "Key", "value": "Value"}]
