# Generated by Django 2.2.10 on 2020-03-04 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0002_auto_20200228_0901"),
    ]

    operations = [
        migrations.AlterField(
            model_name="blocktemplateelement",
            name="type",
            field=models.CharField(
                choices=[
                    ("rich_text", "Rich Text"),
                    ("plain_text", "Plain Text"),
                    ("image", "Image"),
                    ("code", "Code"),
                    ("connection", "Connection"),
                    ("stack", "Stack"),
                ],
                max_length=25,
            ),
        ),
    ]