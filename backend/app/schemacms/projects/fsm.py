import django_fsm
from django.db import models

from . import constants


class DataSourceJobFSM(models.Model):
    job_state = django_fsm.FSMField(
        choices=constants.DATA_SOURCE_JOB_STATE_CHOICES, default=constants.DataSourceJobState.PENDING
    )

    class Meta:
        abstract = True

    @django_fsm.transition(
        job_state,
        source=[constants.DataSourceJobState.PENDING],
        target=constants.DataSourceJobState.PROCESSING,
    )
    def processing(self):
        pass

    @django_fsm.transition(
        job_state,
        source=[constants.DataSourceJobState.PROCESSING],
        target=constants.DataSourceJobState.SUCCESS,
    )
    def success(self):
        self.datasource.set_active_job(self)

    @django_fsm.transition(
        job_state,
        source=[constants.DataSourceJobState.PROCESSING],
        target=constants.DataSourceJobState.FAILED,
    )
    def fail(self):
        pass
