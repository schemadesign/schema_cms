# Generated by Django 2.2.13 on 2020-10-11 19:15

from django.db import migrations, models, transaction
import django.db.models.deletion


def set_internal_connection(apps, schema_editor):
    PageBlockElement = apps.get_model("pages", "PageBlockElement")
    Page = apps.get_model("pages", "Page")

    db_alias = schema_editor.connection.alias

    with transaction.atomic():
        for element in PageBlockElement.objects.using(db_alias).filter(type="internal_connection"):
            try:
                page = Page.objects.get(pk=element.params.get("page_id"))
                element.internal_connection = page
                element.save(update_fields=["internal_connection"])
            except Page.DoesNotExist:
                element.internal_connection = None
                element.save(update_fields=["internal_connection"])


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0059_remove_pageblockelement_internal_connection"),
    ]

    operations = [
        migrations.AddField(
            model_name="pageblockelement",
            name="internal_connection",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="connections",
                to="pages.Page",
            ),
        ),
        migrations.RunPython(set_internal_connection, migrations.RunPython.noop),
    ]
