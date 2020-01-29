# Generated by Django 2.2.8 on 2020-01-29 11:57

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import schemacms.utils.models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0056_auto_20200128_1120'),
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
            ],
            options={'permissions': (('can_undelete', 'Can undelete this object'),), 'abstract': False},
            bases=(schemacms.utils.models.MetaGeneratorMixin, models.Model),
        ),
        migrations.RemoveConstraint(model_name='tag', name='unique_tag_key',),
        migrations.RemoveField(model_name='tag', name='datasource',),
        migrations.RemoveField(model_name='tag', name='key',),
        migrations.AddField(
            model_name='tag',
            name='tags_list',
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='tags',
                to='projects.TagsList',
            ),
            preserve_default=False,
        ),
        migrations.AddConstraint(
            model_name='tag',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=('tags_list', 'value'), name='unique_tag_value'
            ),
        ),
        migrations.AddField(
            model_name='tagslist',
            name='datasource',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='list_of_tags',
                to='projects.DataSource',
            ),
        ),
    ]
