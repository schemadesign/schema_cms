# Generated by Django 2.2.8 on 2019-12-03 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0042_wranglingscript_specs'),
    ]

    operations = [
        migrations.AlterUniqueTogether(name='block', unique_together=set(),),
        migrations.AlterUniqueTogether(name='datasource', unique_together=set(),),
        migrations.AlterUniqueTogether(name='filter', unique_together=set(),),
        migrations.AlterUniqueTogether(name='folder', unique_together=set(),),
        migrations.AlterUniqueTogether(name='page', unique_together=set(),),
        migrations.AddConstraint(
            model_name='block',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=('page', 'name'), name='unique_page_block'
            ),
        ),
        migrations.AddConstraint(
            model_name='datasource',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None),
                fields=('project', 'name'),
                name='unique_project_datasource',
            ),
        ),
        migrations.AddConstraint(
            model_name='filter',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None),
                fields=('datasource', 'name'),
                name='unique_datasource_filter',
            ),
        ),
        migrations.AddConstraint(
            model_name='folder',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=('project', 'name'), name='unique_project_folder'
            ),
        ),
        migrations.AddConstraint(
            model_name='page',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=('folder', 'title'), name='unique_folder_page'
            ),
        ),
    ]