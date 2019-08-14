import pytest_factoryboy

from schemacms.users.tests import factories as users_factories


pytest_factoryboy.register(users_factories.UserFactory)
