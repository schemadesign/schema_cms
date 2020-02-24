from django.conf import settings
from django.contrib.auth import models
from rest_framework import authentication, exceptions
from django.utils.translation import ugettext as _


class LambdaUser:
    id = None
    pk = None
    username = ""
    is_staff = False
    is_active = False
    is_superuser = False
    _groups = models.EmptyManager(models.Group)
    _user_permissions = models.EmptyManager(models.Permission)

    def __str__(self):
        return "LambdaUser"

    def __eq__(self, other):
        return isinstance(other, self.__class__)

    def __hash__(self):
        return 1  # instances always return the same hash value

    def save(self):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    def delete(self):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    def set_password(self, raw_password):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    def check_password(self, raw_password):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    @property
    def groups(self):
        return self._groups

    @property
    def user_permissions(self):
        return self._user_permissions

    def get_group_permissions(self, obj=None):
        return set()

    def get_all_permissions(self, obj=None):
        return models._user_get_all_permissions(self, obj=obj)

    def has_perm(self, perm, obj=None):
        return models._user_has_perm(self, perm, obj=obj)

    def has_perms(self, perm_list, obj=None):
        return all(self.has_perm(perm, obj) for perm in perm_list)

    def has_module_perms(self, module):
        return models._user_has_module_perms(self, module)

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    def get_username(self):
        return self.username


class EnvTokenAuthentication(authentication.BaseAuthentication):
    keyword = "Token"

    def authenticate(self, request):
        auth = authentication.get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            return None
        elif len(auth) > 2:
            return None

        try:
            token = auth[1].decode()
        except UnicodeError:
            return None

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, key):
        if not settings.LAMBDA_AUTH_TOKEN or settings.LAMBDA_AUTH_TOKEN != key:
            raise exceptions.AuthenticationFailed(_("Invalid token."))
        user = LambdaUser()
        return user, key

    def authenticate_header(self, request):
        return self.keyword
