import pytest


@pytest.fixture()
def admin(user_factory):
    return user_factory(admin=True)


@pytest.fixture()
def editor(user_factory):
    return user_factory(editor=True)


@pytest.fixture(params=[dict(admin=True), dict(editor=True)])
def user_with_role(request, user_factory):
    yield user_factory(**request.param)
