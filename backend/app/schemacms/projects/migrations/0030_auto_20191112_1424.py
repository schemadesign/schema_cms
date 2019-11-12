# Generated by Django 2.1.9 on 2019-11-12 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0029_auto_20191107_0954'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='datasourcejob',
            options={'permissions': (('can_undelete', 'Can undelete this object'),)},
        ),
        migrations.AlterModelOptions(
            name='datasourcejobmetadata',
            options={'permissions': (('can_undelete', 'Can undelete this object'),)},
        ),
        migrations.AlterModelOptions(
            name='datasourcejobstep',
            options={'permissions': (('can_undelete', 'Can undelete this object'),)},
        ),
        migrations.AlterModelOptions(
            name='datasourcemeta',
            options={'permissions': (('can_undelete', 'Can undelete this object'),)},
        ),
        migrations.AlterModelOptions(
            name='wranglingscript',
            options={'permissions': (('can_undelete', 'Can undelete this object'),)},
        ),
        migrations.AddField(
            model_name='datasource',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='datasourcejob',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='datasourcejobmetadata',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='datasourcejobstep',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='datasourcemeta',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='filter',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='wranglingscript',
            name='deleted_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
