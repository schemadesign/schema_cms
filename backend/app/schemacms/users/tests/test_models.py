import anymail.exceptions
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

        jwt_payload_handler_mock.assert_called_with(user, extra_data={"auth_method": None, "role": user.role})
        jwt_encode_handler_mock.assert_called_with(jwt_payload_handler_mock.return_value)
        assert token == jwt_encode_handler_mock.return_value

    def test_deactivate_user_flag(self, user_factory):
        user = user_factory(is_active=True)

        ret = user.deactivate()
        user.refresh_from_db()

        assert ret is True
        assert user.is_active is False

    def test_deactivate_remove_from_projects(self, user_factory, project_factory):
        user = user_factory(is_active=True, editor=True)
        project_factory.create_batch(2, editors=[user])

        user.deactivate()

        assert user.assigned_projects.all().count() == 0

    def test_deactivate_user_already_not_active(self, user_factory):
        user = user_factory(is_active=False)

        ret = user.deactivate()
        user.refresh_from_db()

        assert ret is False
        assert user.is_active is False

    def test_delete_user_from_auth_backend(self, faker, user_factory, auth0_management):
        user = user_factory(external_id=faker.word())

        user.delete()

        auth0_management.return_value.users.delete.assert_called_with(user.external_id)

    def test_send_invitation_email(self, mocker, mailoutbox, user_factory):
        redirect_url = "http://redirect.local/redirect"
        mocker.patch(
            "schemacms.users.backend_management.user_mgtm_backend.password_change_url",
            return_value=redirect_url,
        )
        user = user_factory()

        ret = user.send_invitation_email()

        assert ret is True
        assert len(mailoutbox) == 1
        # assert mailoutbox[0].merge_data == {user.email: {'url': redirect_url}}

    def test_send_invitation_email_error(self, mocker, mailoutbox, user_factory):
        mocker.patch(
            "django.core.mail.EmailMessage.send", side_effect=anymail.exceptions.AnymailRequestsAPIError()
        )
        user = user_factory()

        ret = user.send_invitation_email()

        assert ret is False
        assert len(mailoutbox) == 0

    def test_send_invitation_email_captured_exception_by_sentry(self, mocker, user_factory):
        exc = anymail.exceptions.AnymailRequestsAPIError()
        mocker.patch("django.core.mail.EmailMessage.send", side_effect=exc)
        capture_exception_mock = mocker.patch("sentry_sdk.capture_exception")
        user = user_factory()

        user.send_invitation_email()

        capture_exception_mock.assert_called_with(exc)

    def test_assign_external_account(self, user_factory, auth0_management):
        user = user_factory(external_id="", source=user_constants.UserSource.UNDEFINED)

        user.assign_external_account()
        user.refresh_from_db()

        assert user.source == user_constants.UserSource.AUTH0
        assert user.external_id == auth0_management().users.create()["user_id"]

    def test_emails_saving_as_lowercase(self, user_factory):
        email = "UPPER.CASSE@email.com"
        user = user_factory(email=email)

        assert user.email == email.lower()
