# Generated by Django 2.1.9 on 2019-09-02 08:33

import django.core.validators
from django.db import migrations, models
import schemacms.projects.models


class Migration(migrations.Migration):

    dependencies = [("projects", "0004_auto_20190829_1116")]

    operations = [
        migrations.AlterField(
            model_name="datasource",
            name="file",
            field=models.FileField(
                null=True,
                upload_to=schemacms.utils.models.file_upload_path,
                validators=[django.core.validators.FileExtensionValidator(allowed_extensions=["csv"])],
            ),
        ),
        migrations.AlterField(
            model_name="datasource", name="name", field=models.CharField(max_length=25, null=True)
        ),
        migrations.AlterField(
            model_name="datasource",
            name="status",
            field=models.CharField(
                choices=[("draft", "draft"), ("processing", "processing"), ("done", "done")],
                default="draft",
                max_length=25,
            ),
        ),
    ]
