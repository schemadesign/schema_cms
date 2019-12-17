# Generated by Django 2.2.8 on 2019-12-11 09:06

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0043_auto_20191203_0855'),
    ]

    operations = [
        migrations.AddField(
            model_name='datasourcejobmetadata',
            name='fields_names',
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=200), blank=True, default=list, size=None
            ),
        ),
        migrations.AddField(
            model_name='datasourcemeta',
            name='fields_names',
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=200), blank=True, default=list, size=None
            ),
        ),
    ]