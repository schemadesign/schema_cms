# Generated by Django 2.2.13 on 2020-09-30 19:53

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("datasources", "0008_datasourcejob_result_parquet"),
        ("states", "0006_state_fields"),
    ]

    operations = [
        migrations.RemoveField(model_name="state", name="filters",),
        migrations.RenameModel("InStateFilter", "StateFilter"),
    ]