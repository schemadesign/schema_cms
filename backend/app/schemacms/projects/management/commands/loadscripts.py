import os
import datetime
import pathlib

from django.conf import settings
from django.core.files import File
from django.core.management import BaseCommand

from schemacms.projects import models


class Command(BaseCommand):
    help = 'Creating and updating wrangling scripts in database'

    def handle(self, *args, **options):
        directory = pathlib.Path(settings.SCRIPTS_DIRECTORY)
        pattern = "*.py"
        files = [file for file in directory.glob(pattern)]
        existing_scripts = models.WranglingScript.objects.filter(is_predefined=True)
        for file in files:
            name = os.path.splitext(os.path.basename(file))[0]
            modified = self.modification_date(file)
            if not existing_scripts.filter(name=name).exists():
                self.create_script(name, file, modified)
                self.stdout.write(self.style.SUCCESS(f'Script {name} was created!'))
            else:
                script = existing_scripts.get(name=name)
                last_file_modification = script.last_file_modification
                if last_file_modification.strftime('%Y-%m-%d %H:%M:%S') == modified:
                    self.stdout.write(self.style.SUCCESS(f'Script {name} is up-to-date!'))
                else:
                    self.update_script(script, file, modified)
                    self.stdout.write(self.style.SUCCESS(f'Script {name} updated!'))

    @staticmethod
    def modification_date(file):
        t = os.path.getmtime(file)
        return datetime.datetime.fromtimestamp(t).strftime('%Y-%m-%d %H:%M:%S')

    @staticmethod
    def create_script(name, filepath, modified):
        with open(filepath, "rb") as f:
            script = models.WranglingScript()
            script.name = name
            script.file = File(f)
            script.is_predefined = True
            script.last_file_modification = modified
            script.save()


    @staticmethod
    def update_script(script, filepath, modified):
        with open(filepath, "rb") as f:
            script.file = File(f)
            script.last_file_modification = modified
            script.save()
