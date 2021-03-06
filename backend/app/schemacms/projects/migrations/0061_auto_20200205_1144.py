# Generated by Django 2.2.8 on 2020-02-05 11:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import schemacms.utils.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0060_auto_20200203_1402'),
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                (
                    'id',
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
                ),
                ('deleted_at', models.DateTimeField(blank=True, default=None, null=True)),
                (
                    'created',
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True, verbose_name='created'
                    ),
                ),
                (
                    'modified',
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True, verbose_name='modified'
                    ),
                ),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, default='')),
                ('source_url', models.TextField(blank=True, default='')),
                ('is_public', models.BooleanField(default=True)),
                (
                    'author',
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='states',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    'datasource',
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='states',
                        to='projects.DataSource',
                    ),
                ),
                (
                    'project',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='states',
                        to='projects.Project',
                    ),
                ),
            ],
            options={'ordering': ('created',)},
            bases=(schemacms.utils.models.MetaGeneratorMixin, models.Model),
        ),
        migrations.AddConstraint(
            model_name='state',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=('project', 'name'), name='unique_state_name'
            ),
        ),
    ]
