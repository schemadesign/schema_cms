from django.db import models
from django.conf import settings
from django.template.defaultfilters import slugify
from django_extensions.db.fields import AutoSlugField


# Create your models here.
class Projects(models.Model):
    status_choices = (
        ("initial", "initial"),
        ("processing", "processing"),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    slug = AutoSlugField(max_length=255, unique=True, populate_from=('title',))
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=25, choices=status_choices)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(Projects, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
