import os

from django.core.management import BaseCommand

from schemacms.users import models


NEW_USER_USERNAME = "root"


class Command(BaseCommand):
    help = "Create Initial User"

    def handle(self, *args, **options):
        existing_user = models.User.objects.filter(username=NEW_USER_USERNAME).exists()
        password = os.getenv("DJANGO_ROOT_PASSWORD", None)

        if not password:
            self.stdout.write(self.style.ERROR(f"DJANGO_ROOT_PASSWORD environment variable is not set"))
            raise EnvironmentError("DJANGO_ROOT_PASSWORD environment variable is not set")

        if not existing_user:
            models.User.objects.create_superuser(
                NEW_USER_USERNAME, f"{NEW_USER_USERNAME}@apptension.com", password
            )
            self.stdout.write(self.style.SUCCESS(f"{NEW_USER_USERNAME} user created: {password} ℹ️"))
        else:
            root = models.User.objects.get(username=NEW_USER_USERNAME)

            if not root.check_password(password):
                root.set_password(password)
                root.save()
                self.stdout.write(self.style.WARNING(f"{NEW_USER_USERNAME} user password changed 👀"))
