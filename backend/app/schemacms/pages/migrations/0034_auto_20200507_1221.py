# Generated by Django 2.2.10 on 2020-05-07 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0033_remove_blocktemplate_is_template"),
    ]

    operations = [
        migrations.AlterField(
            model_name="blocktemplateelement",
            name="name",
            field=models.CharField(blank=True, default="", max_length=25),
        ),
        migrations.AlterField(
            model_name="pageblockelement",
            name="name",
            field=models.CharField(blank=True, default="", max_length=25),
        ),
    ]