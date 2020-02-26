from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0068_auto_20200224_1630"),
    ]

    database_operations = [
        migrations.AlterModelTable("DataSource", "datasources_datasource"),
        migrations.AlterModelTable("DataSourceMeta", "datasources_datasourcemeta"),
        migrations.AlterModelTable("WranglingScript", "datasources_wranglingscript"),
        migrations.AlterModelTable("DataSourceJob", "datasources_datasourcejob"),
        migrations.AlterModelTable("DataSourceJobMetaData", "datasources_datasourcejobmetadata"),
        migrations.AlterModelTable("DataSourceJobStep", "datasources_datasourcejobstep"),
        migrations.AlterModelTable("Filter", "datasources_filter"),
    ]

    state_operations = [
        migrations.DeleteModel("DataSource"),
        migrations.DeleteModel("DataSourceMeta"),
        migrations.DeleteModel("WranglingScript"),
        migrations.DeleteModel("DataSourceJob"),
        migrations.DeleteModel("DataSourceJobMetaData"),
        migrations.DeleteModel("DataSourceJobStep"),
        migrations.DeleteModel("Filter"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=database_operations, state_operations=state_operations
        )
    ]
