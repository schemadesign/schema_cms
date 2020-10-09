from django.dispatch import receiver
from softdelete.signals import pre_soft_delete, post_soft_delete, post_undelete

from schemacms.pages import models


@receiver(pre_soft_delete, sender=models.Section)
def section_no_longer_rss_when_soft_deleted(sender, instance: models.Section, **kwargs):
    instance.is_rss_content = False
    instance.save(update_fields=["is_rss_content"])
    instance.project.create_xml_file()


@receiver(post_soft_delete, sender=models.Page)
def create_xml_file_when_page_soft_deleted(sender, instance: models.Page, **kwargs):
    if not instance.is_template and instance.section.is_rss_content:
        instance.project.create_xml_file()


@receiver(post_undelete, sender=models.Page)
def create_xml_file_when_page_when_page_undelete(sender, instance: models.Page, **kwargs):
    if not instance.is_template and instance.section.is_rss_content:
        instance.project.create_xml_file()


@receiver(pre_soft_delete, sender=models.Page)
def set_template_in_pages_to_null(sender, instance: models.Page, **kwargs):
    instance.page_set.all().update(template=None)
