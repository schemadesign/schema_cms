# Generated by Django 2.2.10 on 2020-03-17 11:33

from django.db import migrations
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0010_auto_20200317_0956"),
    ]

    operations = [
        migrations.AddField(
            model_name="section",
            name="slug",
            field=django_extensions.db.fields.AutoSlugField(
                allow_duplicates=True, blank=True, editable=False, populate_from="name"
            ),
        ),
    ]
