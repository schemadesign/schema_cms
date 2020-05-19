# Generated by Django 2.2.10 on 2020-05-15 11:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("tags", "0004_tagcategory_type"),
        ("datasources", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="DataSourceTag",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("deleted_at", models.DateTimeField(blank=True, default=None, null=True)),
                ("value", models.CharField(max_length=25)),
                (
                    "category",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.SET_NULL, to="tags.TagCategory"
                    ),
                ),
                (
                    "datasource",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tags",
                        to="datasources.DataSource",
                    ),
                ),
            ],
            options={"permissions": (("can_undelete", "Can undelete this object"),), "abstract": False,},
        ),
    ]