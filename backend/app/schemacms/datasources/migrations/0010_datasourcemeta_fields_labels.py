# Generated by Django 2.2.13 on 2020-12-08 12:20

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('datasources', '0009_auto_20201006_1453'),
    ]

    operations = [
        migrations.AddField(
            model_name='datasourcemeta',
            name='fields_labels',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict),
        ),
    ]
