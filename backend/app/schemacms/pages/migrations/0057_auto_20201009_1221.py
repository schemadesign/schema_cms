# Generated by Django 2.2.13 on 2020-10-09 12:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0056_auto_20201007_0821"),
    ]

    operations = [
        migrations.AlterField(
            model_name="page",
            name="template",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="pages.Page"
            ),
        ),
        migrations.RemoveField(model_name="page", name="blocks",),
        migrations.DeleteModel(name="PageTemplate",),
    ]
