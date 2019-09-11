import urllib.parse

from django import shortcuts
from django.conf import settings
from social_core import exceptions as social_exceptions


class SocialAuthExceptionMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, social_exceptions.AuthException):
            strategy = getattr(request, 'social_strategy', None)
            if strategy:
                url = strategy.session_get('next', settings.DEFAULT_WEBAPP_HOST)
                query_params = urllib.parse.urlencode({
                    'error': exception.__class__.__name__.lower(),
                    'msg': str(exception),
                })
                return shortcuts.redirect(f'{url}?{query_params}')
