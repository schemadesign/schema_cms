from django.core import mail
from django.conf import settings


class EmailTemplate:
    INVITATION_AUTH0 = "schemacms_invitation_auth0"
    INVITATION_OKTA = "schemacms_invitation_okta"


def send_message(email, template, body="", subject="", merge_data_dict=None):
    if not body:
        body = (
            f"Welcome to Schema CMS! Please click the following link to set your password and get started:\n"
            f"{merge_data_dict['url']}"
        )

    message = mail.send_mail(
        subject=subject, message=body, recipient_list=[email], from_email=settings.DEFAULT_FROM_EMAIL
    )

    return message
