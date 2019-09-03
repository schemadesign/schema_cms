from django.core import mail
from django.conf import settings


class MandrillTemplate:
    INVITATION = "schemacms_invitation"


def send_message(email, template, subject="", merge_data_dict=None):
    if settings.DEBUG:
        body = "[DEBUG] Template name: {}, context: {}".format(template, merge_data_dict)
    else:
        body = ""

    message = mail.EmailMessage(
        subject=subject, body=body, to=[email], from_email=settings.DEFAULT_FROM_EMAIL
    )
    message.template_id = template
    if merge_data_dict:
        message.merge_data = {email: merge_data_dict}
    message.send()
