# Generated by Django 2.2.10 on 2020-04-27 11:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0026_auto_20200421_1326"),
    ]

    operations = [
        migrations.AddField(
            model_name="pageblockelement",
            name="custom_element",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="elements",
                to="pages.PageBlockElement",
            ),
        ),
        migrations.AlterField(
            model_name="blockelement",
            name="type",
            field=models.CharField(
                choices=[
                    ("markdown", "Markdown"),
                    ("plain_text", "Plain Text"),
                    ("image", "Image"),
                    ("code", "Code"),
                    ("connection", "Connection"),
                    ("internal_connection", "Internal Connection"),
                    ("custom_element", "Custom Element"),
                ],
                max_length=25,
            ),
        ),
        migrations.AlterField(
            model_name="pageblockelement",
            name="type",
            field=models.CharField(
                choices=[
                    ("markdown", "Markdown"),
                    ("plain_text", "Plain Text"),
                    ("image", "Image"),
                    ("code", "Code"),
                    ("connection", "Connection"),
                    ("internal_connection", "Internal Connection"),
                    ("custom_element", "Custom Element"),
                ],
                max_length=25,
            ),
        ),
    ]
