from django.dispatch import receiver
from softdelete.signals import pre_soft_delete, post_soft_delete

from schemacms.pages import models


@receiver(pre_soft_delete, sender=models.Section)
def section_no_longer_rss_when_soft_deleted(sender, instance: models.Section, **kwargs):
    instance.is_rss_content = False
    instance.save(update_fields=["is_rss_content"])
    instance.project.create_xml_file()


@receiver(post_soft_delete, sender=models.Page)
def create_xml_file_when_page_soft_deleted(sender, instance: models.Page, **kwargs):
    instance.project.create_xml_file()
