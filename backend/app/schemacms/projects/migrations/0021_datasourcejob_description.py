# Generated by Django 2.1.9 on 2019-10-23 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0020_auto_20191022_1425'),
    ]

    operations = [
        migrations.AddField(
            model_name='datasourcejob',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
