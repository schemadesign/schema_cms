# Generated by Django 2.2.10 on 2020-05-22 10:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("tags", "0005_auto_20200519_0900"),
        ("states", "0003_auto_20200511_1157"),
    ]

    operations = [
        migrations.CreateModel(
            name="StateTag",
            fields=[
                (
                    "id",
                    models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID"),
                ),
                ("deleted_at", models.DateTimeField(blank=True, default=None, null=True)),
                ("value", models.CharField(max_length=150)),
            ],
            options={"permissions": (("can_undelete", "Can undelete this object"),), "abstract": False},
        ),
        migrations.RemoveConstraint(model_name="state", name="unique_state_name",),
        migrations.RemoveField(model_name="state", name="active_tags",),
        migrations.RemoveField(model_name="state", name="project",),
        migrations.AlterField(
            model_name="state",
            name="datasource",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="states",
                to="datasources.DataSource",
            ),
        ),
        migrations.AddConstraint(
            model_name="state",
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at=None), fields=("name", "datasource"), name="unique_state_name"
            ),
        ),
        migrations.AddField(
            model_name="statetag",
            name="category",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.SET_NULL, to="tags.TagCategory"
            ),
        ),
        migrations.AddField(
            model_name="statetag",
            name="state",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name="tags", to="states.State"
            ),
        ),
    ]
