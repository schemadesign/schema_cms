# Generated by Django 2.2.13 on 2021-06-21 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("datasources", "0012_auto_20210615_0800"),
    ]

    operations = [
        migrations.AddField(
            model_name="datasourcejob", name="is_auto_refresh", field=models.BooleanField(default=False),
        ),
    ]
