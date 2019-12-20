from django.db import migrations, transaction

from ..constants import ProcessingState


def old_meta_data_to_success(apps, schema_editor):
    MetaData = apps.get_model('projects', 'DataSourceMeta')
    DataSource = apps.get_model('projects', 'DataSource')

    db_alias = schema_editor.connection.alias

    with transaction.atomic():
        MetaData.objects.using(db_alias).filter(status=ProcessingState.PENDING).update(
            status=ProcessingState.SUCCESS
        )
        failed_data_sources = DataSource.objects.using(db_alias).filter(meta_data__isnull=True)

        for data_source in failed_data_sources:
            MetaData.objects.using(db_alias).create(datasource=data_source, status=ProcessingState.FAILED)


def reverse_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0048_auto_20191218_1056'),
    ]

    operations = [
        migrations.RunPython(old_meta_data_to_success, reverse_func),
    ]
