# Generated by Django 2.1.9 on 2019-09-18 11:14

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0008_auto_20190911_1345'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataSourceJob',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('job_state', django_fsm.FSMField(choices=[('pending', 'Pending'), ('in_progress', 'In progress'), ('failed', 'Failed'), ('success', 'Success')], default='pending', max_length=50)),
                ('steps', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('outcome', models.TextField(blank=True)),
                ('scripts_ref', models.CharField(blank=True, max_length=255)),
                ('datasource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jobs', to='projects.DataSource')),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
    ]
