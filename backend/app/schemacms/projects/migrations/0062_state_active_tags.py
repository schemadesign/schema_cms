# Generated by Django 2.2.8 on 2020-02-05 12:37

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0061_auto_20200205_1144'),
    ]

    operations = [
        migrations.AddField(
            model_name='state',
            name='active_tags',
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.IntegerField(), default=list, null=True, size=None
            ),
        ),
    ]
