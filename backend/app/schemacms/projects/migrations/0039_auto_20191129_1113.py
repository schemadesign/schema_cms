# Generated by Django 2.1.9 on 2019-11-29 11:13

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import schemacms.projects.models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0038_auto_20191127_0857'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datasourcejob',
            name='result',
            field=models.FileField(
                blank=True, null=True, upload_to=schemacms.projects.models.file_upload_path
            ),
        ),
        migrations.AlterField(
            model_name='datasourcejobstep',
            name='options',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict),
        ),
    ]
