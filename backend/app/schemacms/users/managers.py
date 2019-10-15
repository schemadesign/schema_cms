from django.db import models
from django.contrib.auth import models as user_models

from . import constants


class UserQuerySet(models.QuerySet):
    def activated(self):
        return self.filter(is_active=True)

    def app_users(self):
        return self.filter(role__in=(constants.UserRole.ADMIN, constants.UserRole.EDITOR)).exclude(is_staff=True)


class UserManager(user_models.UserManager):
    def get_queryset(self):
        return UserQuerySet(self.model, using=self._db)
