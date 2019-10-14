from django.db import models
from django.contrib.auth import models as user_models


class UserQuerySet(models.QuerySet):
    def activated(self):
        return self.filter(is_active=True)


class UserManager(user_models.UserManager):
    def get_queryset(self):
        return UserQuerySet(self.model, using=self._db)
