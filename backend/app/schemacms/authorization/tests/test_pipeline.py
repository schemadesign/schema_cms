from urllib import parse

import pytest

from schemacms.authorization import pipeline
from schemacms.users import constants as users_constants, backend_management


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

        ret = pipeline.associate_by_external_id(backend=backend, details={"user_id": "auth0|123"})

        assert ret == {"user": user, "is_new": False}

    def test_user_not_found(self, user, backend):
        backend.strategy.storage.user.get_user.return_value = None

        ret = pipeline.associate_by_external_id(backend=backend, details={"user_id": "auth0|123"})

        assert ret == {"user": None, "is_new": False}

    @pytest.mark.parametrize("details", [dict(user_id=""), dict()])
    def test_without_external_id(self, user, backend, details):
        backend.strategy.storage.user.get_user.return_value = user

        ret = pipeline.associate_by_external_id(backend=backend, details=details)

        assert ret == {"user": None, "is_new": False}


class TestUpdateExternalId:
    def test_update_external_id(self, backend, user_factory):
        user = user_factory(source=users_constants.UserSource.UNDEFINED, external_id="")
        details = {"user_id": "auth0|123"}

        pipeline.update_external_id(backend=backend, details=details, user=user)

        backend.strategy.storage.user.changed.assert_called_with(user)
        assert user.source == users_constants.UserSource.AUTH0
        assert user.external_id == details["user_id"]

    def test_without_user(self, backend):
        assert pipeline.update_external_id(backend=backend, details={}, user=None) is None

    def test_set_user_is_active_flag(self, backend, user_factory):
        user = user_factory(is_active=False, last_login=None)

        details = {"user_id": "auth0|123", "email_verified": True}

        pipeline.update_external_id(backend=backend, details=details, user=user)

        assert user.is_active is True


class TestUpdateUserFullName:
    def test_without_user(self, strategy):
        assert pipeline.update_user_full_name(strategy, {}, user=None) is None

    @pytest.mark.parametrize("details", [dict(first_name="Test"), dict(last_name="Test"), dict()])
    def test_without_first_or_last_name(self, faker, strategy, user_factory, details):
        user = user_factory(first_name=faker.first_name(), last_name=faker.last_name())

        pipeline.update_user_full_name(strategy, details, user=user)

        assert not strategy.storage.user.changed.called

    def test_user_with_name(self, faker, strategy, user_factory):
        user = user_factory(first_name=faker.first_name(), last_name=faker.last_name())

        pipeline.update_user_full_name(
            strategy, dict(first_name=faker.first_name(), last_name=faker.last_name()), user=user
        )

        assert not strategy.storage.user.changed.called

    def test_change_name(self, faker, strategy, user_factory):
        user = user_factory(first_name="", last_name="")
        details = dict(first_name=faker.first_name(), last_name=faker.last_name())

        pipeline.update_user_full_name(strategy, details, user=user)

        assert strategy.storage.user.changed.called


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
            token=pipeline.generate_signed_exchange_token(user),
        )

        ret = pipeline.redirect_with_token(strategy=strategy, user=user)

        assert ret["Location"] == expected_location


class TestForbidLogInWhenNotRegistered:
    @pytest.mark.parametrize(
        "session_dict, expected_location_template",
        [
            (dict(), "{host}/{path}"),
            (dict(next="http://localhost.com"), "http://localhost.com/{path}"),
            (dict(next="http://localhost.com/"), "http://localhost.com/{path}"),
            (dict(next="http://localhost.com/abc"), "http://localhost.com/abc/{path}"),
            (dict(next="http://localhost.com/def/"), "http://localhost.com/def/{path}"),
        ],
    )
    def test_redirect(self, settings, backend, strategy, session_dict, expected_location_template):
        strategy._session = session_dict
        mgmt = backend_management.user_mgtm_backend
        email = "123@123.com"
        expected_location = (
            expected_location_template.format(host=settings.DEFAULT_WEBAPP_HOST, path="auth/not-registered")
            + f"?{parse.urlencode(dict(state=email))}"
        )

        ret = pipeline.user_exist_in_db(backend, details={"email": email})

        assert ret["Location"] == mgmt.get_logout_url(return_to=expected_location)


class TestUserIsActive:
    def test_user_is_active(self, backend, user_factory):
        user = user_factory(is_active=True)

        ret = pipeline.user_is_active(backend=backend, user=user)

        assert ret is None

    @pytest.mark.parametrize(
        "session_dict, expected_location_template",
        [
            (dict(), "{host}/{path}"),
            (dict(next="http://localhost.com"), "http://localhost.com/{path}"),
            (dict(next="http://localhost.com/"), "http://localhost.com/{path}"),
            (dict(next="http://localhost.com/abc"), "http://localhost.com/abc/{path}"),
            (dict(next="http://localhost.com/def/"), "http://localhost.com/def/{path}"),
        ],
    )
    def test_user_is_not_active(
        self, backend, user_factory, settings, session_dict, expected_location_template
    ):
        user = user_factory(is_active=False)
        backend.strategy._session = session_dict
        mgmt = backend_management.user_mgtm_backend
        expected_location = (
            expected_location_template.format(host=settings.DEFAULT_WEBAPP_HOST, path="auth/revoked-access")
            + f"?{parse.urlencode(dict(state=user.email))}"
        )

        ret = pipeline.user_is_active(backend=backend, user=user)

        assert ret["Location"] == mgmt.get_logout_url(return_to=expected_location)
