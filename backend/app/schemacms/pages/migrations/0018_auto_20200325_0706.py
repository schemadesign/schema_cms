# Generated by Django 2.2.10 on 2020-03-25 07:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0017_auto_20200320_1223"),
    ]

    operations = [
        migrations.AlterModelOptions(name="page", options={"ordering": ("-created",)},),
    ]