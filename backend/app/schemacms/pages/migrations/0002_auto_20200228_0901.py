# Generated by Django 2.2.10 on 2020-02-28 09:01

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(model_name="blocktemplate", name="items",),
        migrations.CreateModel(
            name="BlockTemplateElement",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "type",
                    models.CharField(
                        choices=[("rich_text", "Rich Text"), ("plain_text", "Plain Text")], max_length=25
                    ),
                ),
                ("order", models.PositiveIntegerField(default=0)),
                ("params", django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                (
                    "template",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="elements",
                        to="pages.BlockTemplate",
                    ),
                ),
            ],
            options={"abstract": False},
        ),
    ]
