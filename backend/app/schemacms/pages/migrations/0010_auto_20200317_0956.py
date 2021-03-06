# Generated by Django 2.2.10 on 2020-03-17 09:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0070_auto_20200227_1151"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("pages", "0009_auto_20200315_1523"),
    ]

    operations = [
        migrations.AlterField(model_name="block", name="name", field=models.CharField(max_length=25),),
        migrations.AlterField(model_name="blockelement", name="name", field=models.CharField(max_length=25),),
        migrations.AlterField(model_name="page", name="name", field=models.CharField(max_length=25),),
        migrations.AlterField(model_name="pageblock", name="name", field=models.CharField(max_length=25),),
        migrations.CreateModel(
            name="Section",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("deleted_at", models.DateTimeField(blank=True, default=None, null=True)),
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
                ("is_public", models.BooleanField(default=False)),
                (
                    "created_by",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL
                    ),
                ),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="sections",
                        to="projects.Project",
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="section",
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=("project", "name"), name="unique_section_name"
            ),
        ),
    ]
