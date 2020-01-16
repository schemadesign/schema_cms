from django.core import mail
from django.conf import settings


class EmailTemplate:
    INVITATION = "schemacms_invitation"


def send_message(email, template, subject="", merge_data_dict=None):
    if settings.DEBUG:
        body = f"[DEBUG] Template name: {template}, context: {merge_data_dict['url']}"
    else:
        body = f"Welcome in SchemaCMS app! Please set your password to start work {merge_data_dict['url']}"

    message = mail.send_mail(
        subject=subject, message=body, recipient_list=[email], from_email=settings.DEFAULT_FROM_EMAIL
    )

    return message
