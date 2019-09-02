import pytest

from schemacms.authorization import pipeline
from schemacms.users import constants as users_constants


pytestmark = [pytest.mark.django_db]


@pytest.fixture()
def strategy(mocker):
    strategy_mock = mocker.Mock()
    strategy_mock._session = {}
    strategy_mock.session_get = lambda key, default: strategy_mock._session.get(key, default)
    return strategy_mock


@pytest.fixture()
def backend(mocker, strategy):
    backend_mock = mocker.Mock()
    backend_mock.strategy = strategy
    backend_mock.name = "auth0"
    return backend_mock


class TestAssociateByExternalId:
    def test_return_value(self, user, backend):
        backend.strategy.storage.user.get_user.return_value = user

        ret = pipeline.associate_by_external_id(backend=backend, details={'user_id': 'auth0|123'})

        assert ret == {'user': user, 'is_new': False}

    def test_user_not_found(self, user, backend):
        backend.strategy.storage.user.get_user.return_value = None

        ret = pipeline.associate_by_external_id(backend=backend, details={'user_id': 'auth0|123'})

        assert ret == {'user': None, 'is_new': False}

    @pytest.mark.parametrize('details', [dict(user_id=''), dict()])
    def test_without_external_id(self, user, backend, details):
        backend.strategy.storage.user.get_user.return_value = user

        ret = pipeline.associate_by_external_id(backend=backend, details=details)

        assert ret == {'user': None, 'is_new': False}


class TestUpdateExternalId:
    def test_update_external_id(self, backend, user_factory):
        user = user_factory(source=users_constants.UserSource.UNDEFINED, external_id='')
        details = {'user_id': 'auth0|123'}

        pipeline.update_external_id(backend=backend, details=details, user=user)

        backend.strategy.storage.user.changed.assert_called_with(user)
        assert user.source == users_constants.UserSource.AUTH0
        assert user.external_id == details['user_id']

    def test_without_user(self, backend):
        assert pipeline.update_external_id(backend=backend, details={}, user=None) is None

    def test_set_user_is_active_flag(self, backend, user_factory):
        user = user_factory(is_active=False, last_login=None)

        pipeline.update_external_id(backend=backend, details={'email_verified': True}, user=user)

        assert user.is_active is True


class TestRedirectWithToken:
    @pytest.mark.parametrize(
        "session_dict, expected_location_template",
        [
            (dict(), "{host}/{path}/{user_id}/{token}"),
            (dict(next="http://localhost.com"), "http://localhost.com/{path}/{user_id}/{token}"),
            (dict(next="http://localhost.com/"), "http://localhost.com/{path}/{user_id}/{token}"),
            (dict(next="http://localhost.com/abc"), "http://localhost.com/abc/{path}/{user_id}/{token}"),
            (dict(next="http://localhost.com/def/"), "http://localhost.com/def/{path}/{user_id}/{token}"),
        ],
    )
    def test_redirect(self, mocker, settings, strategy, user, session_dict, expected_location_template):
        strategy._session = session_dict
        mocker.patch.object(user, "get_exchange_token", return_value="fakeExchangeToken")
        expected_location = expected_location_template.format(
            host=settings.DEFAULT_WEBAPP_HOST,
            path="auth/confirm",
            user_id=str(user.id),
            token=user.get_exchange_token(),
        )

        ret = pipeline.redirect_with_token(strategy=strategy, user=user)

        assert ret["Location"] == expected_location
