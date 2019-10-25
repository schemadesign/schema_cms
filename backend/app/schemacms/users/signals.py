from django.dispatch import Signal

user_invited = Signal(providing_args=['user', 'requester'])
user_deactivated = Signal(providing_args=['user', 'requester'])
