# Generated by Django 2.2.10 on 2020-06-08 13:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0042_auto_20200608_1131"),
    ]

    operations = [
        migrations.RemoveField(model_name="pageblockelement", name="state",),
    ]
