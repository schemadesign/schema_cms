# Generated by Django 2.1.9 on 2019-08-29 07:24

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import schemacms.projects.models


class Migration(migrations.Migration):

    dependencies = [("projects", "0002_auto_20190823_1316")]

    operations = [
        migrations.CreateModel(
            name="DataSource",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name="created"
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name="modified"
                    ),
                ),
                ("name", models.CharField(max_length=25)),
                (
                    "type",
                    models.CharField(
                        choices=[("file", "file"), ("database", "database"), ("api", "api")], max_length=25
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("initial", "initial"),
                            ("adding", "adding"),
                            ("preprocessing", "processing"),
                            ("done", "done"),
                        ],
                        default="initial",
                        max_length=25,
                    ),
                ),
                (
                    "file",
                    models.FileField(
                        upload_to=schemacms.projects.models.file_upload_path,
                        validators=[
                            django.core.validators.FileExtensionValidator(
                                allowed_extensions=["csv"],
                                message="DataSource with given name already exists for this project.",
                            )
                        ],
                    ),
                ),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="data_sources",
                        to="projects.Project",
                    ),
                ),
            ],
        ),
        migrations.AlterUniqueTogether(name="datasource", unique_together={("name", "project")}),
    ]
