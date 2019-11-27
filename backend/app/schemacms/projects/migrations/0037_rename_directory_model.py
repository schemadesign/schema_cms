from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0036_auto_20191125_1428'),
    ]

    operations = [
        migrations.RenameModel('Directory', 'Folder'),
        migrations.RenameField('Page', 'directory', 'folder'),
    ]
