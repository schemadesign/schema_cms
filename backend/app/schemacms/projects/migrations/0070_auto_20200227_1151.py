# Generated by Django 2.2.10 on 2020-02-27 11:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0069_moving_datasources"),
    ]

    operations = [
        migrations.RemoveField(model_name="blockimage", name="block",),
        migrations.RemoveField(model_name="folder", name="created_by",),
        migrations.RemoveField(model_name="folder", name="project",),
        migrations.RemoveField(model_name="page", name="created_by",),
        migrations.RemoveField(model_name="page", name="folder",),
        migrations.DeleteModel(name="Block",),
        migrations.DeleteModel(name="BlockImage",),
        migrations.DeleteModel(name="Folder",),
        migrations.DeleteModel(name="Page",),
    ]