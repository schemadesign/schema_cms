import json
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
        with open(os.path.join(directory, "specs.json")) as f:
            all_specs = json.loads(f.read())
            specs_file_modified = self.trunc_datetime(self.modification_date(f.name))
        existing_scripts = models.WranglingScript.objects.filter(is_predefined=True)
        for file in files:
            name = os.path.splitext(os.path.basename(file))[0]
            specs = all_specs.get(name, {})
            replaces = str.maketrans({".": " ", "_": " ", "-": " "})
            name = name.translate(replaces).title()
            file_modified = max(self.trunc_datetime(self.modification_date(file)), specs_file_modified)
            if not existing_scripts.filter(name=name).exists():
                self.create_script(name, file, file_modified, specs)
                self.stdout.write(self.style.SUCCESS(f'Script {name} was created!'))
            else:
                script = existing_scripts.get(name=name)
                last_file_modification = script.last_file_modification
                if file_modified > self.trunc_datetime(last_file_modification):
                    self.update_script(script, file, file_modified, specs)
                    self.stdout.write(self.style.SUCCESS(f'Script {name} updated!'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Script {name} is up-to-date!'))

    @staticmethod
    def modification_date(file):
        t = os.path.getmtime(file)
        return datetime.datetime.fromtimestamp(t)

    @staticmethod
    def trunc_datetime(dt: datetime.datetime):
        return dt.replace(microsecond=0).replace(tzinfo=None)

    @staticmethod
    def create_script(name, filepath, modified, specs=None):
        with open(filepath, "rb") as f:
            script = models.WranglingScript()
            script.name = name
            script.file = File(f)
            script.is_predefined = True
            script.last_file_modification = modified
            script.specs = specs or {}
            script.save()

    @staticmethod
    def update_script(script, filepath, modified, specs=None):
        with open(filepath, "rb") as f:
            script.file = File(f)
            script.last_file_modification = modified
            script.specs = specs or {}
            script.save()
