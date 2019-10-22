import django_fsm
from django.db import models

from . import constants


class DataSourceJobFSM(models.Model):
    job_state = django_fsm.FSMField(
        choices=constants.DATA_SOURCE_JOB_STATE_CHOICES, default=constants.DataSourceJobState.PENDING
    )

    class Meta:
        abstract = True
