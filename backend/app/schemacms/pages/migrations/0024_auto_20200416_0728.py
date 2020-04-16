# Generated by Django 2.2.10 on 2020-04-16 07:28

from django.db import migrations, models
import schemacms.utils.models
import storages.backends.s3boto3


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0023_auto_20200415_1042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pageblockelement',
            name='image',
            field=models.ImageField(null=True, storage=storages.backends.s3boto3.S3Boto3Storage(bucket='schemacms-pages'), upload_to=schemacms.utils.models.file_upload_path),
        ),
    ]
