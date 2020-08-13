# Generated by Django 2.2.10 on 2020-08-13 09:20

import django.core.validators
from django.db import migrations, models
import schemacms.utils.models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0071_project_domain"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="xml_file",
            field=models.FileField(
                null=True,
                upload_to=schemacms.utils.models.file_upload_path,
                validators=[django.core.validators.FileExtensionValidator(allowed_extensions=["xml"])],
            ),
        ),
    ]
