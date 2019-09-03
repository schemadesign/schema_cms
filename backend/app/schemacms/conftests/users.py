import pytest


@pytest.fixture()
def admin(user_factory):
    return user_factory(admin=True)


@pytest.fixture()
def editor(user_factory):
    return user_factory(editor=True)
