import pytest_factoryboy

from schemacms.projects.tests import factories as p_factories
from schemacms.datasources.tests import factories as ds_factories
from schemacms.states.tests import factories as st_factories
from schemacms.users.tests import factories as u_factories


pytest_factoryboy.register(u_factories.UserFactory)
pytest_factoryboy.register(p_factories.ProjectFactory, "project")
pytest_factoryboy.register(ds_factories.DataSourceFactory)
pytest_factoryboy.register(ds_factories.DataSourceMetaFactory)
pytest_factoryboy.register(ds_factories.ScriptFactory, "script")
pytest_factoryboy.register(ds_factories.JobFactory, "job")
pytest_factoryboy.register(ds_factories.JobMetaFactory)
pytest_factoryboy.register(ds_factories.JobStepFactory, "step")
pytest_factoryboy.register(ds_factories.FilterFactory, "filter_")
pytest_factoryboy.register(p_factories.FolderFactory, "folder")
pytest_factoryboy.register(p_factories.PageFactory, "page")
pytest_factoryboy.register(p_factories.BlockFactory, "block")
pytest_factoryboy.register(p_factories.BlockImageFactory, "block_image")
pytest_factoryboy.register(st_factories.TagsListFactory, "tags_list")
pytest_factoryboy.register(st_factories.TagFactory, "tag")
pytest_factoryboy.register(st_factories.StateFactory, "state")
