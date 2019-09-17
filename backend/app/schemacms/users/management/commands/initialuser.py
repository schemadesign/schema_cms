from django.core.management import BaseCommand
from django.utils import crypto

from schemacms.users import models


NEW_USER_USERNAME = 'root'


class Command(BaseCommand):
    help = 'Create initial user'

    def handle(self, *args, **options):
        existing_user = models.User.objects.filter(username=NEW_USER_USERNAME).exists()
        if not existing_user:
            password = crypto.get_random_string(10)
            models.User.objects.create_superuser(
                NEW_USER_USERNAME, f'{NEW_USER_USERNAME}@apptension.com', password
            )
            self.stdout.write(self.style.SUCCESS(f'{NEW_USER_USERNAME} user created: {password} ℹ️'))
        else:
            self.stdout.write(self.style.WARNING(f'{NEW_USER_USERNAME} user seems to already exist 👀'))
