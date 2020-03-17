import pytest_factoryboy

from schemacms.projects.tests import factories as p_factories
from schemacms.datasources.tests import factories as ds_factories
from schemacms.states.tests import factories as st_factories
from schemacms.users.tests import factories as u_factories
from schemacms.pages.tests import factories as pages_factories


pytest_factoryboy.register(u_factories.UserFactory)
pytest_factoryboy.register(p_factories.ProjectFactory, "project")
pytest_factoryboy.register(ds_factories.DataSourceFactory)
pytest_factoryboy.register(ds_factories.DataSourceMetaFactory)
pytest_factoryboy.register(ds_factories.ScriptFactory, "script")
pytest_factoryboy.register(ds_factories.JobFactory, "job")
pytest_factoryboy.register(ds_factories.JobMetaFactory)
pytest_factoryboy.register(ds_factories.JobStepFactory, "step")
pytest_factoryboy.register(ds_factories.FilterFactory, "filter_")
pytest_factoryboy.register(st_factories.TagsListFactory, "tags_list")
pytest_factoryboy.register(st_factories.TagFactory, "tag")
pytest_factoryboy.register(st_factories.StateFactory, "state")
pytest_factoryboy.register(pages_factories.BlockTemplateFactory, "block_template")
pytest_factoryboy.register(pages_factories.PageTemplateFactory, "page_template")
pytest_factoryboy.register(pages_factories.BlockTemplateElementFactory, "block_template_element")
pytest_factoryboy.register(pages_factories.PageBlockFactory, "page_block")
pytest_factoryboy.register(pages_factories.SectionFactory, "section")
