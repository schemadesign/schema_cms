# Generated by Django 2.2.8 on 2020-01-13 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0051_auto_20200108_0917'),
    ]

    operations = [
        migrations.AddField(
            model_name='blockimage',
            name='exec_order',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='blockimage',
            name='image_name',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]