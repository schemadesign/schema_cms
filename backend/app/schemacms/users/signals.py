from django.dispatch import Signal

user_deactivated = Signal(providing_args=['user', 'requester'])
