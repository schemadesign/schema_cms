# Generated by Django 2.2.10 on 2020-02-24 16:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0067_auto_20200210_1500"),
    ]

    operations = [
        migrations.DeleteModel(name="InStateFilter",),
        migrations.DeleteModel(name="State",),
        migrations.DeleteModel(name="Tag",),
        migrations.DeleteModel(name="TagsList",),
    ]