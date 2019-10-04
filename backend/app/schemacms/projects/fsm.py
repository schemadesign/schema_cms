import django_fsm
from django.db import models

from . import constants


class DataSourceProcessingFSM(models.Model):
    status = django_fsm.FSMField(
        choices=constants.DATA_SOURCE_STATUS_CHOICES, default=constants.DataSourceStatus.DRAFT
    )

    class Meta:
        abstract = True

    @django_fsm.transition(
        field=status,
        source=[
            constants.DataSourceStatus.DRAFT,
            constants.DataSourceStatus.READY_FOR_PROCESSING,
            constants.DataSourceStatus.ERROR,
            constants.DataSourceStatus.DONE,
        ],
        target=constants.DataSourceStatus.READY_FOR_PROCESSING,
        on_error=constants.DataSourceStatus.ERROR,
        permission=(lambda inst, user: bool(inst.file)),
    )
    def ready_for_processing(self):
        pass

    @django_fsm.transition(
        field=status,
        source=[
            constants.DataSourceStatus.READY_FOR_PROCESSING,
            constants.DataSourceStatus.ERROR,
        ],
        target=constants.DataSourceStatus.PROCESSING,
        on_error=constants.DataSourceStatus.ERROR,
    )
    def process(self):
        pass

    @django_fsm.transition(
        field=status, source=constants.DataSourceStatus.PROCESSING, target=constants.DataSourceStatus.DONE
    )
    def done(self):
        pass


class DataSourceJobFSM(models.Model):
    job_state = django_fsm.FSMField(
        choices=constants.DATA_SOURCE_JOB_STATE_CHOICES, default=constants.DataSourceJobState.PENDING
    )

    class Meta:
        abstract = True
