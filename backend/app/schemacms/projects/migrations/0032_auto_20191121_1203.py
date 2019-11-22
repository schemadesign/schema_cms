# Generated by Django 2.1.9 on 2019-11-21 12:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import schemacms.utils.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0031_datasourcejobstep_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Directory',
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
                ('name', models.CharField(max_length=25)),
                (
                    'created_by',
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='directories',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    'project',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='directories',
                        to='projects.Project',
                    ),
                ),
            ],
            options={'ordering': ('name',)},
            bases=(schemacms.utils.models.MetaGeneratorMixin, models.Model),
        ),
        migrations.AlterUniqueTogether(name='directory', unique_together={('name', 'project')},),
    ]
