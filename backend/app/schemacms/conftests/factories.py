import pytest_factoryboy

from schemacms.users.tests import factories as users_factories
from schemacms.projects.tests import factories as project_factories

pytest_factoryboy.register(users_factories.UserFactory)
pytest_factoryboy.register(project_factories.ProjectFactory, "project")
pytest_factoryboy.register(project_factories.DataSourceFactory)
pytest_factoryboy.register(project_factories.DataSourceMetaFactory)
pytest_factoryboy.register(project_factories.ScriptFactory, "script")
pytest_factoryboy.register(project_factories.JobFactory, "job")
pytest_factoryboy.register(project_factories.JobMetaFactory)
pytest_factoryboy.register(project_factories.JobStepFactory, "step")
pytest_factoryboy.register(project_factories.FilterFactory, "filter_")
pytest_factoryboy.register(project_factories.FolderFactory, "folder")
pytest_factoryboy.register(project_factories.PageFactory, "page")
pytest_factoryboy.register(project_factories.BlockFactory, "block")
pytest_factoryboy.register(project_factories.BlockImageFactory, "block_image")
