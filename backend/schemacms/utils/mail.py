from django.core import mail
from django.conf import settings


def send_message(email, template, subject='', merge_data_dict=None):
    message = mail.EmailMessage(
        subject=subject,
        body=f"Template name: {template}",
        to=[email],
        from_email=settings.DEFAULT_FROM_EMAIL,
    )
    message.template_id = template
    if merge_data_dict:
        message.merge_data = {
            email: merge_data_dict
        }
    message.send()
