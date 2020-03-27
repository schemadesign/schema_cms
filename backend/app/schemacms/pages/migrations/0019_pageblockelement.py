# Generated by Django 2.2.10 on 2020-03-26 10:43

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import schemacms.utils.models


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0018_auto_20200325_0706"),
    ]

    operations = [
        migrations.CreateModel(
            name="PageBlockElement",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("deleted_at", models.DateTimeField(blank=True, default=None, null=True)),
                ("name", models.CharField(max_length=25)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("rich_text", "Rich Text"),
                            ("plain_text", "Plain Text"),
                            ("image", "Image"),
                            ("code", "Code"),
                            ("connection", "Connection"),
                            ("stack", "Stack"),
                        ],
                        max_length=25,
                    ),
                ),
                ("order", models.PositiveIntegerField(default=0)),
                ("params", django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ("rich_text", models.URLField(blank=True, default="")),
                ("connection", models.TextField(blank=True, default="")),
                ("plain_text", models.TextField(blank=True, default="")),
                ("code", models.TextField(blank=True, default="")),
                ("image", models.ImageField(null=True, upload_to=schemacms.utils.models.file_upload_path)),
                (
                    "block",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="elements",
                        to="pages.PageBlock",
                    ),
                ),
            ],
            options={"abstract": False},
        ),
    ]
