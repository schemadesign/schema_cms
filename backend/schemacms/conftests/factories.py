import pytest_factoryboy

from schemacms.users.tests import factories as users_factories
from schemacms.projects.tests import factories as project_factories

pytest_factoryboy.register(users_factories.UserFactory)
pytest_factoryboy.register(project_factories.ProjectFactory, 'project')
