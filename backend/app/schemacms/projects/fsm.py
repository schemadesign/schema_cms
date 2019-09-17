import django_fsm
from django.db import models

from schemacms.projects import constants


class DataSourceJobFSM(models.Model):
    status = django_fsm.FSMField(
        choices=constants.DATA_SOURCE_JOB_STATUS_CHOICES, default=constants.DataSourceStatus.DRAFT
    )

    class Meta:
        abstract = True

    @django_fsm.transition(
        field=status,
        source=constants.DataSourceStatus.DRAFT,
        target=constants.DataSourceStatus.READY_FOR_PROCESSING,
        on_error=constants.DataSourceStatus.ERROR,
    )
    def ready_for_processing(self):
        pass

    @django_fsm.transition(
        field=status,
        source=constants.DataSourceStatus.READY_FOR_PROCESSING,
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
