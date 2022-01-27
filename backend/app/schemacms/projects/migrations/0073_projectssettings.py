# Generated by Django 2.2.13 on 2022-01-27 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0072_project_xml_file"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProjectsSettings",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("protect_public_api", models.BooleanField(default=False)),
            ],
            options={"abstract": False},
        ),
    ]