# Generated by Django 2.2.10 on 2020-05-25 13:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0036_auto_20200522_1024"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pageblock",
            name="block",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to="pages.BlockTemplate"
            ),
        ),
    ]