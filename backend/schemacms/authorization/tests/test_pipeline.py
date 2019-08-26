import pytest

from schemacms.authorization import pipeline


pytestmark = [pytest.mark.django_db]


class TestRedirectWithToken:
    @pytest.mark.parametrize('session_dict, expected_location_template', [
        (dict(), '{host}/{path}/{user_id}/{token}'),
        (dict(next='http://localhost.com'), 'http://localhost.com/{path}/{user_id}/{token}'),
        (dict(next='http://localhost.com/'), 'http://localhost.com/{path}/{user_id}/{token}'),
        (dict(next='http://localhost.com/abc'), 'http://localhost.com/abc/{path}/{user_id}/{token}'),
        (dict(next='http://localhost.com/def/'), 'http://localhost.com/def/{path}/{user_id}/{token}'),
    ])
    def test_redirect(self, mocker, settings, strategy, user, session_dict, expected_location_template):
        strategy._session = session_dict
        mocker.patch.object(user, 'get_exchange_token', return_value='fakeExchangeToken')
        expected_location = expected_location_template.format(
            host=settings.DEFAULT_WEBAPP_HOST,
            path='auth/confirm',
            user_id=str(user.id),
            token=user.get_exchange_token(),
        )

        ret = pipeline.redirect_with_token(strategy=strategy, user=user)

        assert ret['Location'] == expected_location

    @pytest.fixture()
    def strategy(self, mocker):
        strategy_mock = mocker.Mock()
        strategy_mock._session = {}
        strategy_mock.session_get = lambda key, default: strategy_mock._session.get(key, default)
        return strategy_mock
