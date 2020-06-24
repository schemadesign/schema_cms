# Generated by Django 2.2.10 on 2020-06-24 08:09

from django.db import transaction
from django.db import migrations


def add_names_to_block_templates_elements(apps, schema_editor):
    element = apps.get_model("pages", "BlockTemplateElement")
    db_alias = schema_editor.connection.alias

    with transaction.atomic():
        for custom_element in element.objects.using(db_alias).filter(type="custom_element"):
            elements_list = []

            for e in custom_element.params.get("elements", []):
                if "name" not in e:
                    e["name"] = e["type"]

                elements_list.append(e)

            custom_element.params = {"elements": elements_list}
            custom_element.save()


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0046_auto_20200619_0615"),
    ]

    operations = [
        migrations.RunPython(add_names_to_block_templates_elements),
    ]
