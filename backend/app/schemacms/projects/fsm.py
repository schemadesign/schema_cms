import django_fsm
from django.db import models

from . import constants


class DataSourceJobFSM(models.Model):
    job_state = django_fsm.FSMField(
        choices=constants.PROCESSING_STATE_CHOICES, default=constants.ProcessingState.PENDING
    )

    class Meta:
        abstract = True

    @django_fsm.transition(
        job_state, source=[constants.ProcessingState.PENDING], target=constants.ProcessingState.PROCESSING
    )
    def processing(self):
        pass

    @django_fsm.transition(
        job_state, source=[constants.ProcessingState.PROCESSING], target=constants.ProcessingState.SUCCESS
    )
    def success(self):
        self.datasource.set_active_job(self)

    @django_fsm.transition(
        job_state, source=[constants.ProcessingState.PROCESSING], target=constants.ProcessingState.FAILED
    )
    def fail(self):
        pass
