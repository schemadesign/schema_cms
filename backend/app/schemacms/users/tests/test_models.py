import pytest

from schemacms.users import constants as user_constants, models as user_models

pytestmark = [pytest.mark.django_db]


class TestUser:
    @pytest.mark.parametrize(
        "role, expected", [(user_constants.UserRole.ADMIN, True), (user_constants.UserRole.EDITOR, False)]
    )
    def test_is_admin(self, role, expected):
        user = user_models.User(role=role)

        assert user.is_admin == expected

    def test_str(self, faker):
        username = faker.word()
        user = user_models.User(username=username)

        assert str(user) == username

    def test_get_exchange_token(self, mocker, faker, user):
        make_token_mock = mocker.patch(
            "schemacms.authorization.tokens.exchange_token.make_token", return_value=faker.word()
        )

        token = user.get_exchange_token()

        make_token_mock.assert_called_with(user)
        assert token == make_token_mock.return_value

    def test_get_jwt_token(self, mocker, faker, user):
        jwt_payload_handler_mock = mocker.patch(
            "schemacms.users.models.jwt_payload_handler", return_value=faker.word()
        )
        jwt_encode_handler_mock = mocker.patch(
            "schemacms.users.models.jwt_encode_handler", return_value=faker.word()
        )

        token = user.get_jwt_token()

        jwt_payload_handler_mock.assert_called_with(user)
        jwt_encode_handler_mock.assert_called_with(jwt_payload_handler_mock.return_value)
        assert token == jwt_encode_handler_mock.return_value
