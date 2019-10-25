# Generated by Django 2.1.9 on 2019-10-16 13:10

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0016_auto_20191014_1308'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='editors',
            field=models.ManyToManyField(blank=True, related_name='assigned_projects', to=settings.AUTH_USER_MODEL),
        ),
    ]
