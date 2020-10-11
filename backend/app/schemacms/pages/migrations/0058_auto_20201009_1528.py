# Generated by Django 2.2.13 on 2020-10-09 15:28

from django.db import migrations, models, transaction
import django.db.models.deletion


def set_parent(apps, schema_editor):
    CustomElementSet = apps.get_model("pages", "CustomElementSet")

    db_alias = schema_editor.connection.alias

    with transaction.atomic():
        for set_ in CustomElementSet.objects.using(db_alias).all():
            for element in set_.elementsa.all():
                element.parent = set_.custom_element
                element.save(update_fields=["parent"])


def set_custom_element(apps, schema_editor):
    PageBlockElement = apps.get_model("pages", "PageBlockElement")
    db_alias = schema_editor.connection.alias

    with transaction.atomic():
        for element in PageBlockElement.objects.using(db_alias).filter(custom_element_set__notnull=True):
            element.custom_element_set.custom_element = element.parent
            element.custom_element_set.section.save(update_fields=["custom_element"])


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0057_auto_20201009_1221"),
    ]

    operations = [
        migrations.AddField(
            model_name="pageblockelement",
            name="parent",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sets_elements",
                to="pages.PageBlockElement",
            ),
        ),
        migrations.RunPython(set_parent, set_custom_element),
        migrations.RemoveField(model_name="customelementset", name="custom_element",),
    ]
