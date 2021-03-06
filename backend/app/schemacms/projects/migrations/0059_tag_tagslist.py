# Generated by Django 2.2.8 on 2020-02-02 11:51

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import schemacms.utils.models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0058_delete_tag'),
    ]

    operations = [
        migrations.CreateModel(
            name='TagsList',
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
                ('is_active', models.BooleanField(default=True)),
                (
                    'datasource',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='list_of_tags',
                        to='projects.DataSource',
                    ),
                ),
            ],
            options={'permissions': (('can_undelete', 'Can undelete this object'),), 'abstract': False},
            bases=(schemacms.utils.models.MetaGeneratorMixin, models.Model),
        ),
        migrations.CreateModel(
            name='Tag',
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
                ('value', models.CharField(max_length=150)),
                ('exec_order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                (
                    'tags_list',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='tags',
                        to='projects.TagsList',
                    ),
                ),
            ],
            options={'ordering': ('created',)},
            bases=(schemacms.utils.models.MetaGeneratorMixin, models.Model),
        ),
    ]
