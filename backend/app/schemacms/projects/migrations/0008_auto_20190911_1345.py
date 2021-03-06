# Generated by Django 2.1.9 on 2019-09-11 13:45

from django.db import migrations
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_datasource_created_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datasource',
            name='status',
            field=django_fsm.FSMField(choices=[('draft', 'draft'), ('ready_for_processing', 'ready for processing'), ('processing', 'processing'), ('done', 'done'), ('error', 'error')], default='draft', max_length=50),
        ),
        migrations.AlterField(
            model_name='project',
            name='status',
            field=django_fsm.FSMField(choices=[('initial', 'initial'), ('processing', 'processing')], default='initial', max_length=50),
        ),
    ]
